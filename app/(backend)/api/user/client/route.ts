import { NextRequest, NextResponse } from "next/server";
import { addNewClient, getAllClients } from "./controller";
import { authMiddleware } from "@/app/(backend)/_middelware/auth";

export async function POST(req: NextRequest) {
  try {
    const { type, id } = await authMiddleware(req, "BROKER");
    const clients = await addNewClient(req, id, type);
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { type, id } = await authMiddleware(req, "BROKER");
    return await getAllClients(req, id, type);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}