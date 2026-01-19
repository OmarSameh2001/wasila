import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../../../_middelware/authorize";
import { authError } from "@/app/(backend)/_lib/errors";
import { getBrokerById } from "../controller";
import dynamicId from "@/app/(backend)/_lib/dynamic_id";

export async function GET(req: NextRequest, context: any) {
  try {
    const { id: userId, type } = await authMiddleware(req, "USER");
    const id = dynamicId(req.url);
    
    return await getBrokerById(req, Number(userId), type, Number(id));
  } catch (error) {
    console.error("Error getting user:", error);
    return authError((error as Error).message);
  }
}
