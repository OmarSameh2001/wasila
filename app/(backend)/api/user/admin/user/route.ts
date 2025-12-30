import { authMiddleware } from "@/app/(backend)/_middelware/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllBrokers, getAllUsers } from "../contoller";
import { authError } from "@/app/(backend)/_lib/errors";

export async function GET(req: NextRequest) {
  try {
    await authMiddleware(req, "ADMIN");
    const brokers = await getAllUsers(req);
    return brokers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return authError((error as Error).message);
  }
}
