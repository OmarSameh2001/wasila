import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "../controller";

export async function POST(req: NextRequest) {
  try {
    const token = await logoutUser(req);
    return token;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
