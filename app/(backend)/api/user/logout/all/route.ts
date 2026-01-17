import { NextRequest, NextResponse } from "next/server";
import { logoutAllDevices } from "../../controller";

export async function POST(req: NextRequest) {
  try {
    const token = await logoutAllDevices(req);
    return token;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
