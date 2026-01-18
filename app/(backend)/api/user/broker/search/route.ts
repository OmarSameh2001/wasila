import { authMiddleware } from "@/app/(backend)/_middelware/authorize";
import { NextRequest } from "next/server";
import { authError } from "@/app/(backend)/_lib/errors";
import { searchUser } from "../../admin/controller";

export async function GET(req: NextRequest, context: any) {
  try {
    await authMiddleware(req, "USER");
    const company = await searchUser(req, "BROKER");
    return company;
  } catch (error) {
    return authError((error as Error).message);
  }
}
