import { NextRequest, NextResponse } from "next/server";
import { changeClient, deleteClient, getClientById } from "../controller";
import { authMiddleware } from "../../../../_middelware/authorize";
import { authError } from "@/app/(backend)/_lib/errors";
import dynamicId from "@/app/(backend)/_lib/dynamic_id";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    // const { id: clientId } = context.params;
    const clientId = dynamicId(req.url);

    return await getClientById(req, Number(id), type, Number(clientId));
  } catch (error) {
    console.error("Error getting user:", error);
    return authError((error as Error).message);
  }
}
export async function PUT(
  req: NextRequest,
  context: any,
) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    // const { id: clientId } = context.params;
    const clientId = dynamicId(req.url);

    return await changeClient(req, Number(id), type, Number(clientId));
  } catch (error) {
    console.error("Error changing user type:", error);
    return authError((error as Error).message);
  }
}

export async function DELETE(
  req: NextRequest,
  context: any,
) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    // const { id: clientId } = context.params;
    const clientId = dynamicId(req.url);

    return await deleteClient(req, Number(id), type, Number(clientId));
  } catch (error) {
    console.error("Error deleting user:", error);
    return authError((error as Error).message);
  }
}
