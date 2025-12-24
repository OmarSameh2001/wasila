import { NextRequest, NextResponse } from "next/server";
import { getRecordsByBroker } from "../controller";
import { brokerMiddleware } from "../../../_middelware/auth";

export async function GET(req: NextRequest) {
    try {
        const {id, type} = await brokerMiddleware(req);
        const records = await getRecordsByBroker(req, Number(id), type);
        return records;
    } catch (error) {
        console.error("Error fetching records:", error);
        return NextResponse.json(
            { error: error },
            { status: 401 }
        );
    }
}