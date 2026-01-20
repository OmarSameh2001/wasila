import "server-only";
import { NextResponse } from "next/server";
import UserHelper from "../_lib/user";

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