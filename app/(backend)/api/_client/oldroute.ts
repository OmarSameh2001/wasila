// import { NextRequest, NextResponse } from "next/server";
// import { createClient, deleteClient, getClients, updateClient } from "./controller";
// import { create } from "domain";
// import { brokerMiddleware } from "../../_middelware/auth";

// export async function GET(req: NextRequest) {
//   try {
//     const clients = await getClients(req);
//     return clients;
//   } catch (error) {
//     console.error("Error fetching clients:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { type } = await brokerMiddleware(req);
//     const clients = await createClient(req, type);
//     return clients;
//   } catch (error) {
//     console.error("Error fetching clients:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const { id, type } = await brokerMiddleware(req);
//     const clients = await updateClient(req, Number(id), type);
//     return clients;
//   } catch (error) {
//     console.error("Error fetching clients:", error);
//     return NextResponse.json({ error: error }, { status: 401 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { id, type } = await brokerMiddleware(req);
//     const clients = await deleteClient(req, Number(id), type);
//     return clients;
//   } catch (error) {
//     console.error("Error fetching clients:", error);
//     return NextResponse.json({ error: error }, { status: 401 });
//   }
// }
