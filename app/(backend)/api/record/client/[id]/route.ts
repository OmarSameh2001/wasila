import { NextRequest, NextResponse } from "next/server";
import { getRecordByClient } from "../../controller";
import { authMiddleware } from "../../../../_middelware/auth";

export async function GET(req: NextRequest, params: Promise<{ id: string }>) {
  try {
    const { id, type } = await authMiddleware(req, "USER");
    // const id=1
    // const type="USER"
    const { id: clientId } = await params;
    const records = await getRecordByClient(req, id, type, Number(clientId));
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}
