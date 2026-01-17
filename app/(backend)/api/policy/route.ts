import { NextRequest, NextResponse } from "next/server";
import {
  createPolicy,
  deletePolicy,
  getPolicies,
  updatePolicy,
} from "./controller";
import { authMiddleware } from "../../_middelware/authorize";
import { authError } from "../../_lib/errors";

export async function GET(req: NextRequest) {
  try {
    const { id, type } = await authMiddleware(req, "ALL");
    return getPolicies(req,id,type);
  } catch (error) {
    return authError((error as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    return createPolicy(req, id, type);
  } catch (error) {
    return authError((error as Error).message);
  }
}

