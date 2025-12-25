import { NextRequest, NextResponse } from "next/server";
import {
  createPolicy,
  deletePolicy,
  getPolicies,
  updatePolicy,
} from "./controller";
import { authMiddleware } from "../../_middelware/auth";

export async function GET(req: NextRequest) {
  return getPolicies(req);
}

export async function POST(req: NextRequest) {
  try {
    authMiddleware(req, "BROKER");
    return createPolicy(req);
  } catch (error) {
    return NextResponse.json({ error:(error as Error).message }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    return deletePolicy(req, Number(id), type);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message  }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    return updatePolicy(req, Number(id), type);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message  }, { status: 401 });
  }
}
