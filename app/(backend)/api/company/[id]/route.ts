import { authMiddleware } from "@/app/(backend)/_middelware/auth";
import { NextRequest } from "next/server";
import { getCompanyById } from "../controller";
import { authError } from "@/app/(backend)/_lib/errors";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { id } = context.params;
    await authMiddleware(req, "ALL");
    const policy = await getCompanyById(req, Number(id));
    return policy;
  } catch (error) {
    return authError((error as Error).message);
  }
}
