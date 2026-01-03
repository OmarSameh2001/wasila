import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { filterPrisma } from "../../_lib/filtering";

export async function createPolicy(req: NextRequest) {
  try {
    const { type, name, companyId, tax, brokerId, carDetails, healthDetails } = await req.json();

    const policy = await prisma.policy.create({
      data: {
        type,
        name,
        companyId: Number(companyId),
        tax: tax ? Number(tax) : null,
        ...(brokerId && { brokerId: Number(brokerId) }),
        
        // Conditionally create car policy
        ...(type === "CAR" && carDetails && {
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
        ...((type === "HEALTH" || type === "SME") && healthDetails && {
          healthPolicy: {
            create: {
              // Life Benefits
              lifeInsurance: healthDetails.lifeInsurance,
              totalPermanentDisability: healthDetails.totalPermanentDisability,
              accidentalDeath: healthDetails.accidentalDeath,
              partialPermanentDisability: healthDetails.partialPermanentDisability,
              
              // Medical Benefits
              medicalTpa: healthDetails.medicalTpa,
              network: healthDetails.network,
              areaOfCoverage: healthDetails.areaOfCoverage,
              annualCeilingPerPerson: Number(healthDetails.annualCeilingPerPerson),
              
              // In-Patient Benefits
              inPatientAccommodation: healthDetails.inPatientAccommodation,
              icu: healthDetails.icu,
              parentAccommodation: healthDetails.parentAccommodation,
              
              // Out-Patient Benefits
              doctorConsultation: healthDetails.doctorConsultation,
              labScan: healthDetails.labScan,
              physiotherapy: healthDetails.physiotherapy,
              medication: healthDetails.medication,
              
              // Additional Benefits
              dental: healthDetails.dental,
              optical: healthDetails.optical,
              maternityLimit: healthDetails.maternityLimit,
              newbornCeiling: healthDetails.newbornCeiling,
              
              // Other Benefits
              preExistingCases: healthDetails.preExistingCases,
              newChronic: healthDetails.newChronic,
              organTransplant: healthDetails.organTransplant,
              groundAmbulance: healthDetails.groundAmbulance,
              
              // Reimbursement Rules
              reimbursementCoverage: healthDetails.reimbursementCoverage,
              
              
              // Handle nested pricing (composite type array)
              healthPricings: healthDetails.healthPricings?.map((pricing: any) => ({
                minAge: Number(pricing.minAge),
                maxAge: Number(pricing.maxAge),
                mainPrice: Number(pricing.mainPrice),
                dependentPrice: Number(pricing.dependentPrice),
              })) || [],
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
      { error: "Error creating policy", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function getPolicies(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const include = {
      company: true,
    };
    return await filterPrisma(
      prisma.policy,
      page,
      limit,
      {},
      url,
      "policy",
      include
    );

    // return NextResponse.json(policies, { status: 200 });
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
        healthPolicy:  true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          }
        },
        broker: {
          select: {
            id: true,
            name: true,
          }
        }
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
  try {
    const body = await req.json();
    const { type, name, companyId, tax, carDetails, healthDetails, ...otherData } = body;

    // Build the where clause
    const whereClause: any = { id: Number(id) };
    if (userType === "BROKER" && brokerId) {
      whereClause.brokerId = Number(brokerId);
    }

    // First, fetch the existing policy to know its type
    const existingPolicy = await prisma.policy.findUnique({
      where: whereClause,
      include: {
        carPolicy: true,
        healthPolicy: true,
      },
    });

    if (!existingPolicy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Build update data
    const updateData: any = {
      ...(name && { name }),
      ...(companyId && { companyId: Number(companyId) }),
      ...(tax !== undefined && { tax: tax ? Number(tax) : null }),
    };

    // Update car policy if type is CAR and carDetails provided
    if (existingPolicy.type === "CAR" && carDetails) {
      if (existingPolicy.carPolicy) {
        updateData.carPolicy = {
          update: {
            ownDamage: carDetails.ownDamage,
            thirdParty: carDetails.thirdParty,
            fire: carDetails.fire,
            theft: carDetails.theft,
            make: carDetails.make,
            model: carDetails.model,
            year: Number(carDetails.year),
            mileage: Number(carDetails.mileage),
          },
        };
      } else {
        updateData.carPolicy = {
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
        };
      }
    }

    // Update health policy if type is HEALTH or SME and healthDetails provided
    if ((existingPolicy.type === "HEALTH" || existingPolicy.type === "SME") && healthDetails) {
      const healthData: any = {
        // Life Benefits
        lifeInsurance: healthDetails.lifeInsurance,
        totalPermanentDisability: healthDetails.totalPermanentDisability,
        accidentalDeath: healthDetails.accidentalDeath,
        partialPermanentDisability: healthDetails.partialPermanentDisability,
        
        // Medical Benefits
        medicalTpa: healthDetails.medicalTpa,
        network: healthDetails.network,
        areaOfCoverage: healthDetails.areaOfCoverage,
        annualCeilingPerPerson: Number(healthDetails.annualCeilingPerPerson),
        
        // In-Patient Benefits
        inPatientAccommodation: healthDetails.inPatientAccommodation,
        icu: healthDetails.icu,
        parentAccommodation: healthDetails.parentAccommodation,
        
        // Out-Patient Benefits
        doctorConsultation: healthDetails.doctorConsultation,
        labScan: healthDetails.labScan,
        physiotherapy: healthDetails.physiotherapy,
        medication: healthDetails.medication,
        
        // Additional Benefits
        dental: healthDetails.dental,
        optical: healthDetails.optical,
        maternityLimit: healthDetails.maternityLimit,
        newbornCeiling: healthDetails.newbornCeiling,
        
        // Other Benefits
        preExistingCases: healthDetails.preExistingCases,
        newChronic: healthDetails.newChronic,
        organTransplant: healthDetails.organTransplant,
        groundAmbulance: healthDetails.groundAmbulance,
        
        // Reimbursement Rules
        reimbursementCoverage: healthDetails.reimbursementCoverage,
        
        // Enrollment & Pricing
        numberOfInsuredMembers: Number(healthDetails.numberOfInsuredMembers),
        averagePremiumPerHead: Number(healthDetails.averagePremiumPerHead),
        
        // Handle nested pricing (composite type array)
        healthPricings: healthDetails.healthPricings?.map((pricing: any) => ({
          minAge: Number(pricing.minAge),
          maxAge: Number(pricing.maxAge),
          mainPrice: Number(pricing.mainPrice),
          dependentPrice: Number(pricing.dependentPrice),
        })) || [],
      };

      if (existingPolicy.healthPolicy) {
        updateData.healthPolicy = {
          update: healthData,
        };
      } else {
        updateData.healthPolicy = {
          create: healthData,
        };
      }
    }

    const policy = await prisma.policy.update({
      where: whereClause,
      data: updateData,
      include: {
        carPolicy: true,
        healthPolicy: true,
        company: true,
        broker: true,
      },
    });

    return NextResponse.json(policy, { status: 200 });
  } catch (error) {
    console.error("Error updating policy:", error);
    return NextResponse.json(
      { error: "Error updating policy", details: error instanceof Error ? error.message : String(error) },
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

export async function searchPolicy(
  req: NextRequest,
) {
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
      { }
    );
  } catch (error) {}
}
