import { NextRequest, NextResponse } from "next/server";
import { getRecordsByBroker } from "../../controller";
import { authMiddleware } from "../../../../_middelware/auth";

export async function GET(req: NextRequest, params: Promise<{ id: string }>) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    const { id: brokerId } = await params;
    const records = await getRecordsByBroker(req, Number(id), type, Number(brokerId));
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}
