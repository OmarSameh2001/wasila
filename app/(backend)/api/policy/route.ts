import { NextRequest, NextResponse } from "next/server";
import {
  createPolicy,
  deletePolicy,
  getPolicies,
  updatePolicy,
} from "./controller";
import { authMiddleware } from "../../_middelware/auth";
import { authError } from "../../_lib/errors";

export async function GET(req: NextRequest) {
  try {
    await authMiddleware(req, "ALL");
    return getPolicies(req);
  } catch (error) {
    return authError((error as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    authMiddleware(req, "BROKER");
    return createPolicy(req);
  } catch (error) {
    return authError((error as Error).message);
  }
}

