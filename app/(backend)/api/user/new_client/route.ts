import { NextRequest, NextResponse } from "next/server";
import { addNewClient } from "../controller";
import { authMiddleware } from "../../../_middelware/auth";

export async function POST(req: NextRequest) {
    try {
        const { type, id } = await authMiddleware(req, "ADMIN");
        const clients = await addNewClient(req, id, type);
        return clients;
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}