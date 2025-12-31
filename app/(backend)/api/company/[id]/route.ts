import { authMiddleware } from "@/app/(backend)/_middelware/auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteCompany, getCompanyById, updateCompany } from "../controller";
import { authError } from "@/app/(backend)/_lib/errors";
import dynamicId from "@/app/(backend)/_lib/dynamic_id";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await authMiddleware(req, "ALL");
    // const { id } = context.params;
    const id = dynamicId(req.url);
    const policy = await getCompanyById(Number(id));
    return policy;
  } catch (error) {
    return authError((error as Error).message);
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    authMiddleware(req, "ADMIN");
    const id = dynamicId(req.url);
    return await deleteCompany(Number(id));
  } catch (error) {
    console.error("Error deleting company:", error);
    return authError((error as Error).message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    authMiddleware(req, "ADMIN");
    const id = dynamicId(req.url);
    return await updateCompany(req, Number(id));
  } catch (error) {
    console.error("Error updating company:", error);
    return authError((error as Error).message);
  }
}