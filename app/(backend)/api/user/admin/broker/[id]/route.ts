import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../../../../_middelware/auth";
import { authError } from "@/app/(backend)/_lib/errors";
import { getBrokerById } from "../../contoller";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await authMiddleware(req, "ADMIN");
    const { id } = context.params;

    return await getBrokerById(req, Number(id));
  } catch (error) {
    console.error("Error getting user:", error);
    return authError((error as Error).message);
  }
}