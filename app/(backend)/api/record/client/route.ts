import { NextRequest, NextResponse } from "next/server";
import { getRecordByClient } from "../controller";
import { userMiddleware } from "../../../_middelware/auth";

export async function GET(req: NextRequest) {
  try {
    const { id, type } = await userMiddleware(req);
    const records = await getRecordByClient(req, Number(id), type);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json({ error: error }, { status: 401 });
  }
}
