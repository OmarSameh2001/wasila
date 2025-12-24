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

export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    if(!decoded){
      throw new Error("Invalid token");
    }
    return {
      id: decoded.id,
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

export async function userMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    if (decoded.type !== "USER" && decoded.type !== "ADMIN") {
      throw new Error("User access required");
    }
    // Attach user info to request headers for use in controllers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.id);
    requestHeaders.set("x-user-type", decoded.type);

    return {
      id: decoded.id,
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

export async function brokerMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    if (decoded.type !== "BROKER" && decoded.type !== "ADMIN") {
      throw new Error("User access required");
    }
    return {
      id: decoded.id,
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

// Admin-only middleware
export async function adminMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    // Check if user is admin
    if (decoded.type !== "ADMIN") {
      throw new Error("Admin access required");
    }

    // Attach admin info to request headers
    return {
      id: decoded.id,
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
