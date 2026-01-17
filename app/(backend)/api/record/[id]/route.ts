import { NextRequest, NextResponse } from "next/server";
import { deleteRecord, getRecord, updateRecord } from "../controller";
import { authMiddleware } from "@/app/(backend)/_middelware/authorize";
import dynamicId from "@/app/(backend)/_lib/dynamic_id";

export async function GET(req: NextRequest, context: any) {
  try {
    const { id, type } = await authMiddleware(req, "ALL");
    // const { id: recordId } = context.params;
    const recordId = dynamicId(req.url);
    const numRecordId = Number(recordId);
    if (!numRecordId)
      return NextResponse.json(
        { error: "Client id is required and must be a number" },
        { status: 400 }
    )
    const records = await getRecord(req, id, type, numRecordId);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: any) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    // const { id: recordId } = context.params;
    const recordId = dynamicId(req.url);
    const numRecordId = Number(recordId);
    if (!numRecordId)
      return NextResponse.json(
        { error: "Record id is required and must be a number" },
        { status: 400 }
      );
    const records = await updateRecord(req, id, type, numRecordId);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }   
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    const { id, type } = await authMiddleware(req, "BROKER");
    // const { id: recordId } = context.params;
    const recordId = dynamicId(req.url);
    const numRecordId = Number(recordId);
    if (!numRecordId)
      return NextResponse.json(
        { error: "Record id is required and must be a number" },
        { status: 400 }
      );
    const records = await deleteRecord(req, id, type, numRecordId);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
