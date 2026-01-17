import { authMiddleware } from "@/app/(backend)/_middelware/authorize";
import { NextRequest } from "next/server";
import { getAllBrokers } from "../contoller";
import { authError } from "@/app/(backend)/_lib/errors";

export async function GET(req: NextRequest) {
  try {
    await authMiddleware(req, "ADMIN");
    const brokers = await getAllBrokers(req);
    return brokers;
  } catch (error) {
    console.error("Error fetching brokers:", error);
    return authError((error as Error).message);
  }
}
