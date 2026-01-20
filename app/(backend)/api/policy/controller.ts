import 'server-only'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { filterPrisma, handleUrl } from "../../_lib/filtering";
import modelFields from "../../_lib/fields";

export async function createPolicy(
  req: NextRequest,
  userId: number,
  userType: string
) {
  try {
    const { type, name, companyId, tax, brokerId, carDetails, healthPolicy } =
      await req.json();

    const policy = await prisma.policy.create({
      data: {
        type,
        name,
        companyId: Number(companyId),
        tax: tax ? Number(tax) : null,
        ...(userType === "BROKER"
          ? { brokerId: Number(userId) }
          : { brokerId: Number(brokerId) }),

        // Conditionally create car policy
        ...(type === "CAR" &&
          carDetails && {
            carPolicy: {
              create: {
                ownDamage: carDetails.ownDamage,
                thirdParty: carDetails.thirdParty,
                fire: carDetails.fire,
                theft: carDetails.theft,
                make: carDetails.make,
                model: carDetails.model,
                year: Number(carDetails.year),
                mileage: Number(carDetails.mileage),
              },
            },
          }),

        // Conditionally create health policy
        ...((type === "Individual_Medical" || type === "SME") &&
          healthPolicy && {
            healthPolicy: {
              create: {
                // Life Benefits
                lifeInsurance: healthPolicy.lifeInsurance,
                totalPermanentDisability: healthPolicy.totalPermanentDisability,
                accidentalDeath: healthPolicy.accidentalDeath,
                partialPermanentDisability:
                  healthPolicy.partialPermanentDisability,

                // Medical Benefits
                medicalTpa: healthPolicy.medicalTpa,
                network: healthPolicy.network,
                areaOfCoverage: healthPolicy.areaOfCoverage,
                annualCeilingPerPerson: healthPolicy.annualCeilingPerPerson,

                // In-Patient Benefits
                inPatientAccommodation: healthPolicy.inPatientAccommodation,
                icu: healthPolicy.icu,
                parentAccommodation: healthPolicy.parentAccommodation,

                // Out-Patient Benefits
                doctorConsultation: healthPolicy.doctorConsultation,
                labScan: healthPolicy.labScan,
                physiotherapy: healthPolicy.physiotherapy,
                medication: healthPolicy.medication,

                // Additional Benefits
                dental: healthPolicy.dental,
                optical: healthPolicy.optical,
                maternityLimit: healthPolicy.maternityLimit,
                newbornCeiling: healthPolicy.newbornCeiling,

                // Other Benefits
                preExistingCases: healthPolicy.preExistingCases,
                newChronic: healthPolicy.newChronic,
                organTransplant: healthPolicy.organTransplant,
                groundAmbulance: healthPolicy.groundAmbulance,

                // Reimbursement Rules
                reimbursementCoverage: healthPolicy.reimbursementCoverage,

                healthPricings: healthPolicy.healthPricings,
              },
            },
          }),
      },
      include: {
        carPolicy: true,
        healthPolicy: true,
        company: true,
        broker: true,
      },
    });

    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    console.error("Error creating policy:", error);
    return NextResponse.json(
      {
        error: "Error creating policy",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function getPolicies(
  req: NextRequest,
  userId: number,
  userType: string
) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const include = {
      company: true,
      broker: true,
    };

    const urlFilters = handleUrl(url, "policy");
        
    const { brokerId: urlBrokerId, ...otherFilters } = urlFilters;
    
    let whereClause: any = { ...otherFilters };
    // console.log(urlFilters);
    // Handle broker-specific logic
    if (userType === "BROKER") {
      if (urlBrokerId !== undefined) {
        whereClause.brokerId = urlBrokerId;
      } else {
        whereClause.OR = [
          { brokerId: Number(userId) },
          { brokerId: null }
        ];
      }
    } else if (urlBrokerId !== undefined) {
      // Non-broker user specified brokerId filter
      whereClause.brokerId = urlBrokerId;
    }
    const sortField = url?.searchParams.get("sort");
    const sortOrder = url?.searchParams.get("order") || "asc";

    // Build orderBy object
    let newOrderBy: any = undefined;
    if (sortField && modelFields["policy"]?.[sortField]) {
      newOrderBy = { [sortField]: sortOrder === "desc" ? "desc" : "asc" };
    }

    return await filterPrisma(
      prisma.policy,
      page,
      limit,
      whereClause,
      undefined,
      "policy",
      include,
      {},
      newOrderBy
    );
  } catch (error) {
    console.error("Error fetching policies:", error);
    return NextResponse.json(
      { error: "Error fetching policies" },
      { status: 500 }
    );
  }
}
// export async function getPoliciesByCompany(req: NextRequest) {
//   try {
//     const { companyId } = await req.json();
//     const policies = await prisma.policy.findMany({
//       where: {
//         companyId,
//       },
//       include: {
//         carPolicy: true,
//         healthPolicy: true,
//       },
//     });

//     return NextResponse.json(policies, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching policies:", error);
//     return NextResponse.json(
//       { error: "Error fetching policies" },
//       { status: 500 }
//     );
//   }
// }

export async function getPolicyById(req: NextRequest, id: number) {
  try {
    // const { id: _id } = await req.json();
    // id = id || _id;
    const ids = Array.isArray(id) ? id : [id];
    const policies = await prisma.policy.findUnique({
      where: {
        id,
      },
      include: {
        carPolicy: true,
        healthPolicy: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        broker: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(policies, { status: 200 });
  } catch (error) {
    console.error("Error fetching policy:", error);
    return NextResponse.json(
      { error: "Error fetching policy" },
      { status: 500 }
    );
  }
}

export async function updatePolicy(
  id: number,
  req: NextRequest,
  brokerId?: number,
  userType?: string
) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const policyId = Number(id);

    // Build safety for numeric types
    const companyId = body.companyId ? Number(body.companyId) : undefined;
    const taxValue = body.tax !== undefined ? Number(body.tax) : undefined;

    const policyWhere: any = { id: policyId };
    if (userType === "BROKER" && brokerId) {
      policyWhere.brokerId = Number(brokerId);
    }


    // SINGLE CALL: This handles Policy + HealthPolicy + JSON in one go
    // 1. Destructure the healthPolicy to remove the problematic IDs
    // We pull out 'id' and 'policyId' and group everything else into 'restOfHealth'
    const { id: _, policyId: __, ...restOfHealth } = body.healthPolicy;

    const result = await prisma.policy.update({
      where: { id: policyId },
      data: {
        name: body.name,
        companyId: companyId,
        tax: taxValue,
        updatedAt: new Date(),
        healthPolicy: {
          upsert: {
            create: {
              ...restOfHealth,
              // Ensure healthPricings is passed as the object it is
              healthPricings: restOfHealth.healthPricings || {},
            },
            update: {
              ...restOfHealth,
              healthPricings: restOfHealth.healthPricings || {},
            },
          },
        },
      },
      include: {
        // carPolicy: true,
        healthPolicy: true,
        company: true,
        broker: true,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("❌ updatePolicy FAILED:", error);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function deletePolicy(id: number, brokerId: number, type: string) {
  try {
    const policy = await prisma.policy.delete({
      where: { id, ...(type === "BROKER" && { brokerId }) },
    });
    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    return NextResponse.json(policy, { status: 200 });
  } catch (error) {
    console.error("Error deleting policy:", error);
    return NextResponse.json(
      { error: "Error deleting policy" },
      { status: 500 }
    );
  }
}

export async function searchPolicy(req: NextRequest) {
  try {
    const url = new URL(req.url);
    return await filterPrisma(
      prisma.policy,
      1,
      10,
      {},
      url,
      "policy",
      { company: { select: { name: true, logo: true } } },
      {}
    );
  } catch (error) {}
}
