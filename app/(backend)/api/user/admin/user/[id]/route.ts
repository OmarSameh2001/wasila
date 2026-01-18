import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../../../../_middelware/authorize";
import { authError } from "@/app/(backend)/_lib/errors";
import { getUserById } from "../../controller";
import dynamicId from "@/app/(backend)/_lib/dynamic_id";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await authMiddleware(req, "ADMIN");
    // const { id } = context.params;
    const id = dynamicId(req.url);

    return await getUserById(req, Number(id));
  } catch (error) {
    console.error("Error getting user:", error);
    return authError((error as Error).message);
  }
}