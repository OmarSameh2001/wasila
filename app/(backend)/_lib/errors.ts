import "server-only"
import { NextResponse } from "next/server";

export const authError = (message: string) => {
    switch (message) {
      case "Unauthorized access":
        return NextResponse.json({ message: "You are not authorized to access this resource" }, { status: 403 });
      case "Invalid token":
        return NextResponse.json({ message: "The token provided is invalid" }, { status: 401 });
      case "Token expired":
        return NextResponse.json({ message: "The token provided has expired", key: "Token_Expired" }, { status: 401 });
      case "Authentication failed":
        return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
      default:
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};


export function handlePrismaError(error: any) {
  if (!error.code) {
    // Not a Prisma known error
    console.error("Unknown error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  switch (error.code) {
    case "P2002": {
      // Unique constraint failed
      const fields = error.meta?.target?.join(", ") || "field";
      return NextResponse.json(
        { error: `A record with the same ${fields} already exists.` },
        { status: 400 }
      );
    }

    case "P2003": {
      // Foreign key constraint failed
      const field = error.meta?.field_name || "related record";
      return NextResponse.json(
        { error: `Invalid reference for ${field}.` },
        { status: 400 }
      );
    }

    case "P2025": {
      // Record not found
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    case "P2011": {
      // Null constraint violation
      const field = error.meta?.target?.join(", ") || "field";
      return NextResponse.json(
        { error: `${field} cannot be null.` },
        { status: 400 }
      );
    }

    default:
      console.error("Unhandled Prisma error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
