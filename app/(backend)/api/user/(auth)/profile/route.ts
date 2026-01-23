import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, updateUser } from "../controller";
import { authMiddleware } from "@/app/(backend)/_middelware/authorize";

export async function GET(req: NextRequest) {
  try {
    const { id, type } = await authMiddleware(req, "ALL");
    return getCurrentUser(Number(id), type);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.headers.get("x-user-id");
    return updateUser(req, Number(id));
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}