import { NextRequest, NextResponse } from "next/server";
import { calculateSmePolicyRecords } from "../../controller";
import { authMiddleware } from "@/app/(backend)/_middelware/auth";

export async function POST(req: NextRequest, context: any) {
  try {
    await authMiddleware(req, "BROKER");
    const records = await calculateSmePolicyRecords(req);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}