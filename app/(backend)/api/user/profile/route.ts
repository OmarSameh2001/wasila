import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../controller";

export async function GET(req: NextRequest) {
  try {
    const id = req.headers.get("x-user-id");
    return getCurrentUser(Number(id));
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
