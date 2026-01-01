import { authMiddleware } from "@/app/(backend)/_middelware/auth";
import { NextRequest } from "next/server";
import { searchClient } from "../controller";
import { authError } from "@/app/(backend)/_lib/errors";


export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    const company = await searchClient(req, Number(id), type);
    return company;
  } catch (error) {
    return authError((error as Error).message);
  }
}