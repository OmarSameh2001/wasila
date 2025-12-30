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