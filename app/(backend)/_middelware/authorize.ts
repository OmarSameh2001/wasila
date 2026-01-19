import "server-only";

import { NextRequest } from "next/server";

export async function authMiddleware(
  req: NextRequest,
  type: "USER" | "ADMIN" | "BROKER" | "ALL"
): Promise<{
  id: number;
  type: "USER" | "ADMIN" | "BROKER";
}> {

  const userId = req.headers.get("x-user-id")!;
  const userType = req.headers.get("x-user-type")! as
    | "USER"
    | "ADMIN"
    | "BROKER";
    
  if (type !== "ALL" && userType !== type && userType !== "ADMIN") {
    throw new Error("Unauthorized access");
  }

  return {
    id: Number(userId),
    type: userType,
  };
}
