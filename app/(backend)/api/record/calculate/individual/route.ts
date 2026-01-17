import { NextRequest, NextResponse } from "next/server";
import { calculateIndividualPolicyRecords } from "../../controller";
import { authMiddleware } from "@/app/(backend)/_middelware/authorize";

export async function POST(req: NextRequest, context: any) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    const records = await calculateIndividualPolicyRecords(req, id, type);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}