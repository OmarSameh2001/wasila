import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { filterPrisma } from "../../_lib/filtering";

export async function createPolicy(req: NextRequest) {
  try {
    const { type, name, companyId, tax } = await req.json();

    const policy = await prisma.policy.create({
      data: {
        type,
        companyId: Number(companyId),
        tax,
        name,
        // 2. Conditionally create subtypes
        // ...(type === "CAR" &&
        //   carDetails && {
        //     carPolicy: {
        //       create: carDetails,
        //     },
        //   }),
        // ...((type === "HEALTH" || type === "SME") &&
        //   healthDetails && {
        //     healthPolicy: {
        //       create: {
        //         ...healthDetails,
        //         // Handle nested pricing for health policies
        //         healthPricings: {
        //           create: healthDetails.healthPricings,
        //         },
        //       },
        //     },
        //   }),
      },
      include: {
        carPolicy: true,
        healthPolicy: {
          include: { healthPricings: true },
        },
      },
    });
    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    console.error("Error creating policy:", error);
    return NextResponse.json(
      { error: "Error creating policy" },
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
    const { id: _id } = await req.json();
    id = id || _id;
    const ids = Array.isArray(id) ? id : [id];
    const policies = await prisma.policy.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        carPolicy: true,
        healthPolicy: {
          include: { healthPricings: true },
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
  brokerId: number,
  type: string
) {
  try {
    const { id, ...data } = await req.json();
    const policy = await prisma.policy.update({
      where: { id, ...(type === "BROKER" && { brokerId }) },
      data: { ...data },
    });
    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    return NextResponse.json(policy, { status: 200 });
  } catch (error) {
    console.error("Error updating policy:", error);
    return NextResponse.json(
      { error: "Error updating policy" },
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
