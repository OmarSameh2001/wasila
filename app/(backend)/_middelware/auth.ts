import "server-only";

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export interface AuthPayload {
  id: string;
  type: "USER" | "ADMIN" | "BROKER";
  iat: number;
  exp: number;
}

export async function authMiddleware(
  req: NextRequest,
  type: "USER" | "ADMIN" | "BROKER" | "ALL"
): Promise<{
  id: number;
  type: "USER" | "ADMIN" | "BROKER";
}> {
  try {
    // const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";

    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      throw new Error("Token not found");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    if (!decoded) {
      throw new Error("Invalid token");
    }

    if (type === "ALL") return { id: Number(decoded.id), type: decoded.type };

    if (decoded.type !== type && decoded.type !== "ADMIN") {
      throw new Error("Unauthorized access");
    }

    return {
      id: Number(decoded.id),
      type: decoded.type,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }

    throw new Error("Authentication failed");
  }
}
