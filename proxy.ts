import "server-only";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AuthPayload } from "./app/(backend)/_lib/dto";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_ENDPOINT = "/api/user/refresh";

const SECRET_KEY = (() => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }
  return new TextEncoder().encode(JWT_SECRET);
})();

function createUnauthorizedResponse() {
  return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
}

function redirectToRefresh(req: NextRequest) {
  const url = new URL(REFRESH_ENDPOINT, req.url);

  url.searchParams.set("returnUrl", req.nextUrl.pathname + req.nextUrl.search);

  return NextResponse.redirect(url, { status: 307 });
}

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY, {
        algorithms: ["HS256"],
      });

      const authPayload = payload as unknown as AuthPayload;

      if (!authPayload.id || !authPayload.type) {
        return createUnauthorizedResponse();
      }

      const response = NextResponse.next();
      response.headers.set("x-user-id", authPayload.id);
      response.headers.set("x-user-type", authPayload.type);

      return response;
    } catch {
      return refreshToken
        ? redirectToRefresh(req)
        : createUnauthorizedResponse();
    }
  } else if (refreshToken) {
    return redirectToRefresh(req);
  } else {
    return createUnauthorizedResponse();
  }
}

export const config = {
  matcher: [
    "/api/company/:path*",
    "/api/record/:path*",
    "/api/policy/:path*",
    "/api/user/admin/:path*",
    "/api/user/client/:path*",
    "/api/user/broker/:path*",
    "/api/user/me/:path*",
    "/api/user/profile/:path*",
    "/api/user/logout/:path*",
    // "/api/user/refresh/:path*",
  ],
};
