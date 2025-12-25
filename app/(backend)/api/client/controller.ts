// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "../../_lib/prisma";
// import { filterPrisma } from "../../_lib/filtering";

// export async function getClients(req: NextRequest) {
//   try {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);
//     const params = Object.fromEntries(
//       Object.entries(url.searchParams).filter(
//         ([key]) => key !== "page" && key !== "limit"
//       )
//     );
//     const clients = await filterPrisma(prisma.client, page, limit, params);
//     return NextResponse.json(clients, { status: 200 });
//   } catch (error) {
//     console.error("Error getting clients:", error);
//     return NextResponse.json(
//       { error: "Error getting clients" },
//       { status: 500 }
//     );
//   }
// }

// export async function createClient(req: NextRequest, type: string) {
//   try {
//     let { name, email, ...data } = await req.json();
//     // Only admins can create client with email
//     email = type === "ADMIN" ? email : null;
//     const client = await prisma.client.create({
//       data: {
//         name,
//         email,
//         ...data,
//       },
//     });
//     return NextResponse.json(client, { status: 201 });
//   } catch (error) {
//     console.error("Error creating client:", error);
//     return NextResponse.json(
//       { error: "Error creating client" },
//       { status: 500 }
//     );
//   }
// }

// export async function updateClient(
//   req: NextRequest,
//   userId: number,
//   type: "ADMIN" | "BROKER"
// ) {
//   try {
//     const { id: clientId, name, email, ...data } = await req.json();

//     const client = await prisma.client.findUnique({
//       where: { id: clientId },
//       include: { user: true },
//     });

//     if (!client) {
//       return NextResponse.json(
//         { error: "Client not found" },
//         { status: 404 }
//       );
//     }

//     // Broker cannot update a client who became a user
//     if (type === "BROKER" && client.user) {
//       return NextResponse.json(
//         { error: "Client is already a user and cannot be updated" },
//         { status: 403 }
//       );
//     }

//     // Broker ownership check
//     if (type === "BROKER" && client.brokerId !== userId) {
//       return NextResponse.json(
//         { error: "Not authorized" },
//         { status: 403 }
//       );
//     }

//     const updatedClient = await prisma.client.update({
//       where: { id: clientId },
//       data: {
//         name,
//         ...(type === "ADMIN" && { email }),
//         ...data,
//       },
//     });

//     return NextResponse.json(updatedClient, { status: 200 });
//   } catch (error) {
//     console.error("Error updating client:", error);
//     return NextResponse.json(
//       { error: "Error updating client" },
//       { status: 500 }
//     );
//   }
// }

// export async function deleteClient(
//   req: NextRequest,
//   brokerId: number,
//   type: "ADMIN" | "BROKER"
// ) {
//   try {
//     const { id } = await req.json();
//     const client = await prisma.client.delete({
//       where: { id, ...(type === "BROKER" && { brokerId }) },
//     });
//     if (!client) {
//       return NextResponse.json(
//         { error: "Client not found or not authorized" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(client, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting client:", error);
//     return NextResponse.json(
//       { error: "Error deleting client" },
//       { status: 500 }
//     );
//   }
// }
