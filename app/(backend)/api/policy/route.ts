import { NextRequest, NextResponse } from "next/server";
import { createPolicy, deletePolicy, getPolicies, updatePolicy } from "./controller";
import { brokerMiddleware } from "../../_middelware/auth";

export async function GET(req: NextRequest) {
  return getPolicies(req);
}

export async function POST(req: NextRequest) {
  try {
    brokerMiddleware(req);
    return createPolicy(req);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, type } = await brokerMiddleware(req);
    return deletePolicy(req, Number(id), type);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, type } = await brokerMiddleware(req);
    return updatePolicy(req, Number(id), type);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}