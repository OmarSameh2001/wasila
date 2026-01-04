import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { filterPrisma } from "../../_lib/filtering";

export async function getRecords(
  req: NextRequest,
  userId: number,
  type: string
) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const params: any = {};
    if (type === "BROKER") params.brokerId = userId;
    if (type === "USER") params.clientId = userId;

    return await filterPrisma(
      prisma.record,
      page,
      limit,
      params,
      url,
      "record"
    );

    // return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Error fetching records" },
      { status: 500 }
    );
  }
}

export async function getRecord(
  req: NextRequest,
  userId: number,
  type: string,
  recordId: number
) {
  try {
    const record = await prisma.record.findUnique({
      where: {
        id: recordId,
        ...(type === "BROKER"
          ? { brokerId: userId }
          : type === "USER" && { clientId: userId }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        broker: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        policy: {
          select:{
            id: true,
            name: true
          }
        },
      },
    });
    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Error fetching record" },
      { status: 500 }
    );
  }
}

// export async function getRecordsByBroker(
//   req: NextRequest,
//   userId: number,
//   type: string,
//   brokerId: number
// ) {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);

//     brokerId = type === "BROKER" ? userId : brokerId;
//     if (!brokerId)
//       return NextResponse.json({ error: "Missing brokerId" }, { status: 400 });

//     console.log(prisma.record.fields);
//     const records = await filterPrisma(
//       prisma.record,
//       page,
//       limit,
//       { brokerId },
//       url,
//       "record"
//     );

//     return NextResponse.json(records, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching records:", error);
//     return NextResponse.json(
//       { error: "Error fetching records" },
//       { status: 500 }
//     );
//   }
// }

// export async function getRecordByClient(
//   req: NextRequest,
//   userId: number,
//   type: string,
//   clientId: number
// ) {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);

//     clientId = type === "USER" ? userId : clientId;
//     if (!clientId)
//       return NextResponse.json({ error: "Missing clientId" }, { status: 400 });

//     const records = await filterPrisma(
//       prisma.record,
//       page,
//       limit,
//       { clientId },
//       url,
//       "record"
//     );
//     return NextResponse.json(records, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching records:", error);
//     return NextResponse.json(
//       { error: "Error fetching records" },
//       { status: 500 }
//     );
//   }
// }

export async function createRecord(req: NextRequest) {
  try {
    const {
      policyId,
      clientId,
      brokerId,
      totalAmount,
      state,
      carDetails,
      healthDetails,
    } = await req.json();
    const record = await prisma.record.create({
      data: {
        policyId,
        clientId,
        brokerId,
        totalAmount,
        state: state || "DRAFT",
        ...(carDetails && { carDetails }),
        ...(healthDetails && { healthDetails }),
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Error creating record" },
      { status: 500 }
    );
  }
}

export async function updateRecord(
  req: NextRequest,
  userId: number,
  type: string,
  id: number
) {
  try {
    const { data } = await req.json();

    const { clientId, brokerId: _brokerId, ...newData } = data;
    const recordData = type === "BROKER" ? newData : data
    const record = await prisma.record.update({
      where: { id, ...(type === "BROKER" && { brokerId: userId }) },
      data: {...recordData},
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Error updating record" },
      { status: 500 }
    );
  }
}

export async function deleteRecord(
  req: NextRequest,
  brokerId: number,
  type: string,
  id: number
) {
  try {
    
    const record = await prisma.record.delete({
      where: { id, ...(type === "BROKER" && { brokerId }) },
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Error deleting record" },
      { status: 500 }
    );
  }
}
