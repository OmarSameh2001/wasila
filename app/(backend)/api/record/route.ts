import { NextRequest, NextResponse } from "next/server";
import {
  createRecord,
  deleteRecord,
  getRecords,
  updateRecord,
} from "./controller";
import { authMiddleware } from "../../_middelware/auth";

export async function POST(req: NextRequest) {
  try {
    await authMiddleware(req, "BROKER");
    const records = await createRecord(req);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await authMiddleware(req, "ADMIN");
    const records = await getRecords(req);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    const records = await deleteRecord(req, Number(id), type);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    const records = await updateRecord(req, Number(id), type);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
