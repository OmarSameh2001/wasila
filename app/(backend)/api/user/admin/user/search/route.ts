
import { authMiddleware } from "@/app/(backend)/_middelware/auth";
import { NextRequest } from "next/server";
import { authError } from "@/app/(backend)/_lib/errors";
import { searchUser } from "../../contoller";


export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await authMiddleware(req, "ADMIN");
    const company = await searchUser(req, "USER");
    return company;
  } catch (error) {
    return authError((error as Error).message);
  }
}