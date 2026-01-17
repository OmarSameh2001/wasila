import { authMiddleware } from "@/app/(backend)/_middelware/authorize";
import { NextRequest } from "next/server";
import { searchCompany } from "../controller";
import { authError } from "@/app/(backend)/_lib/errors";


export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    await authMiddleware(req, "ALL");
    const company = await searchCompany(req);
    return company;
  } catch (error) {
    return authError((error as Error).message);
  }
}