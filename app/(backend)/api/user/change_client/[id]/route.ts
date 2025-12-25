import { NextRequest, NextResponse } from "next/server";
import { changeClient } from "../../controller";
import { authMiddleware } from "../../../../_middelware/auth";

export async function POST(req: NextRequest, params: Promise<{ id: string }>) {
    try {
        const { id, type } = await authMiddleware(req, "BROKER");
        const { id: clientId } = await params;
        const user = await changeClient(req, Number(id), type, Number(clientId));
        return user;
    } catch (error) {
        console.error("Error changing user type:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 401 });
    }
}