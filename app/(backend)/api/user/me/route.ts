import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.headers.get("x-user-id");
  const type = req.headers.get("x-user-type");
  
  return NextResponse.json({ id, type }, { status: 200 });
}
