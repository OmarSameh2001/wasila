import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../controller";
import { authMiddleware } from "../../../_middelware/auth";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    const { id } = authResult;
    return getCurrentUser(Number(id));
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
