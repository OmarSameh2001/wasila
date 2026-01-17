import { authMiddleware } from "@/app/(backend)/_middelware/authorize";
import { NextRequest } from "next/server";
import { deletePolicy, getPolicyById, updatePolicy } from "../controller";
import { authError } from "@/app/(backend)/_lib/errors";
import dynamicId from "@/app/(backend)/_lib/dynamic_id";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    // const { id } = context.params;
    const id = dynamicId(req.url);
    await authMiddleware(req, "ALL");
    const policy = await getPolicyById(req, Number(id));
    return policy;
  } catch (error) {
    return authError((error as Error).message);
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    // const { id: policyId } = context.params;
    const policyId = dynamicId(req.url);
    const { id, type } = await authMiddleware(req, "BROKER");
    return deletePolicy(Number(policyId), Number(id), type);
  } catch (error) {
    return authError((error as Error).message);
  }
}


export async function PUT(req: NextRequest, context: any) {
  try {
    // const { id: policyId } = context.params;
    const policyId = dynamicId(req.url);
    const { id, type } = await authMiddleware(req, "BROKER");
    return updatePolicy(Number(policyId),req, Number(id), type);
  } catch (error) {
    return authError((error as Error).message);
  }
}
