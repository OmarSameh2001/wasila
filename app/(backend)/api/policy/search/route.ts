import { authMiddleware } from "@/app/(backend)/_middelware/auth";
import { NextRequest } from "next/server";
import { searchPolicy } from "../controller";
import { authError } from "@/app/(backend)/_lib/errors";


export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await authMiddleware(req, "ALL");
    const company = await searchPolicy(req);
    return company;
  } catch (error) {
    return authError((error as Error).message);
  }
}