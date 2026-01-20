import 'server-only'
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import UserHelper from "@/app/(backend)/_lib/user";
import { prisma } from "../../../../_lib/prisma";
import { UserBackend } from "@/app/(backend)/_lib/dto";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets not configured");
}

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const returnUrl = req.nextUrl.searchParams.get("returnUrl");

  if (!refreshToken) {
    return createErrorResponse("Unauthorized access no refresh token");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/api",
  };

  try {
    const { payload } = await jwtVerify(refreshToken, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    

    const userId = payload.id as number;

    if (!userId) {
      throw new Error("Invalid token payload");
    }

    const user = await UserHelper.token.returnRefreshedUser(refreshToken);

    if (!user) {
      throw new Error("User not found");
    }
    const newAccessToken = UserHelper.token.generateAccessToken(user);

    const responseData = {
      message: "Token refreshed successfully",
      user: {
        id: user.id,
        type: user.type,
      },
    };

    const response = returnUrl
      ? NextResponse.redirect(new URL(returnUrl, req.url), { status: 307 })
      : NextResponse.json(responseData, { status: 200 });

    response.cookies.set("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 , // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Token refresh failed:", error);

    const response = createErrorResponse("Unauthorized access");

    response.cookies.set("accessToken", "", {
      ...cookieOptions,
      expires: new Date(0),
    });

    response.cookies.set("refreshToken", "", {
      ...cookieOptions,
      expires: new Date(0),
    });

    return response;
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

function createErrorResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 401 });
}
