import "server-only";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import UserHelper from "./app/(backend)/_lib/user";
import { AuthPayload } from "./app/(backend)/_lib/dto";

const JWT_SECRET = process.env.JWT_SECRET;

async function handleRefresh(refreshToken: string) {
  const user = await UserHelper.token.returnRefreshedUser(refreshToken);

  if (user && user.id && user.type) {
    const newAccessToken = UserHelper.token.generateAccessToken(user);
    const response = NextResponse.next();

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  }
}
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  try {
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET!) as unknown as AuthPayload;
      if (decoded.id && decoded.type) {
        const response = NextResponse.next();
        response.headers.set("x-user-id", decoded.id);
        response.headers.set("x-user-type", decoded.type);
        return response;
      }

      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 },
      );
    } else if (refreshToken) {
      return handleRefresh(refreshToken);
    } else {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 },
      );
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError && refreshToken) {
      return handleRefresh(refreshToken);
    }
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/api/company/:path*",
    "/api/record/:path*",
    "/api/policy/:path*",
    "/api/user/admin/:path*",
    "/api/user/client/:path*",
    "/api/user/me/:path*",
    "/api/user/profile/:path*",
    "/api/user/logout/:path*",
    // "/api/user/refresh/:path*",
  ],
};
