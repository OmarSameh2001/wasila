import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../_lib/prisma";
import UserHelper from "../../../_lib/user";
import { filterPrisma } from "../../../_lib/filtering";
import crypto from "crypto";
import sendEmail from "../../../_lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET;
const frontendUrl = process.env.NEXT_PUBLIC_BASE_URL;

export interface JWTPayload {
  id: string;
  type: "USER" | "ADMIN" | "BROKER";
}

// export const refreshAccessToken = async (req: NextRequest) => {
//   try {
//     const refreshToken = req.cookies.get("refreshToken")?.value;
//     if (!refreshToken) {
//       return NextResponse.json({ error: "No refresh token" }, { status: 401 });
//     }

//     const user = await UserHelper.token.returnRefreshedUser(refreshToken);

//     if (!user.id || !user.refreshToken) {
//       return NextResponse.json(
//         { error: "Invalid refresh token" },
//         { status: 403 }
//       );
//     }

//     const newAccessToken = UserHelper.token.generateAccessToken(user);

//     const res = NextResponse.json(
//       {
//         message: "Access token refreshed successfully",
//         user: {
//           name: user.name,
//           email: user.email,
//           id: user.id,
//           type: user.type,
//           username: user.username,
//         },
//       },
//       { status: 200 }
//     );

//     res.cookies.set("accessToken", newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 24, // 1 hour
//     });

//     return res;
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Refresh token expired" },
//       { status: 403 }
//     );
//   }
// };

// Register User
export const registerUser = async (req: NextRequest) => {
  try {
    const { email, password, name, username, type } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 },
      );
    }

    const validateEmail = UserHelper.validateEmail(email);
    if (!validateEmail.success) {
      return NextResponse.json(
        { error: validateEmail.message },
        { status: 400 },
      );
    }

    const validatePassword = UserHelper.validatePassword(password);
    if (!validatePassword.success) {
      return NextResponse.json(
        { error: validatePassword.message },
        { status: 400 },
      );
    }

    // Check if user exists
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUsers?.length > 0) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 },
      );
    }
    // if (type !== "USER" && type !== "BROKER") {
    //   return NextResponse.json(
    //     { error: "Invalid user type you can only be user or broker" },
    //     { status: 400 }
    //   );
    // }

    // Hash password
    const hashedPassword = (await UserHelper.hashPassword(password))
      .hashedPassword;

    // Generate email verification token
    const verificationToken = UserHelper.token.generateVerificationToken();
    const hashedToken = UserHelper.token.hashToken(verificationToken);
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Send email verification link
    sendEmail(
      email,
      "Welcome to wasila",
      `
        <h1>Welcome to wasila</h1>
        <p>Hello ${name},</p>
        <p>Please use this link to verify your email:</p>
        <a href="${frontendUrl}/verify-email?token=${verificationToken}&email=${email}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>Dont share this link with anyone.</p>
      `,
    );

    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        type: "BROKER", // for now all users are brokers
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: tokenExpiry,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          username: createdUser.username,
          type: createdUser.type,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error registering user, please try again or contact support" },
      { status: 500 },
    );
  }
};

// Login User
export const loginUser = async (req: NextRequest) => {
  try {
    const { email, password, remember } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide email and password" },
        { status: 400 },
      );
    }

    // Find user and select password + refreshToken
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error:
            "Please verify your email before logging in. Check your inbox for the verification link.",
        },
        { status: 403 },
      );
    }

    // Compare passwords
    const isPasswordMatch = await UserHelper.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate tokens
    const accessToken = UserHelper.token.generateAccessToken(user);
    const refreshToken = UserHelper.token.generateRefreshToken(user);
    const hashedRefreshToken = UserHelper.token.hashToken(refreshToken);

    // Add new refresh token to array (keep last 5 sessions)
    const updatedTokens = [
      hashedRefreshToken,
      ...(user.refreshTokens || []).slice(0, 4), // Keep max 5 sessions
    ];

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokens: updatedTokens,
      },
    });

    // Response
    const res = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
        },
      },
      { status: 200 },
    );

    // Set refresh token as httpOnly cookie ✅
    // if (remember) {
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    // }

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api",
      maxAge: 60 * 60, // 1 hour
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// Get All Users (Admin only)
export const getAllUsers = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const users = await filterPrisma(prisma.user, page, limit, {}, url, "user");

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// Update User
export const updateUser = async (req: NextRequest, userId: number) => {
  try {
    const { name, email } = await req.json();

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// Delete User (Admin only)
export const deleteUser = async (req: NextRequest, userId: number) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// Get Current User
export const getCurrentUser = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        type: true,
        email: true,
        name: true,
        username: true,
        contactInfo: true,
        dob: true,
        createdAt: true,
        managedCount: true,
        clientCount: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Current user fetched successfully",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const verifyEmail = async (req: NextRequest) => {
  try {
    const { token, email } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = UserHelper.token.hashToken(token);

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        email,
        emailVerified: false,
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified successfully! You can now log in.",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// NEW: Resend Verification Email
export const resendVerification = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    if (user) {
      if (user.emailVerified) {
        return NextResponse.json(
          { error: "Email is already verified" },
          { status: 400 },
        );
      }
      if (
        user.emailVerificationExpiry &&
        UserHelper.isTimePassed(user.emailVerificationExpiry, 24 * 60, 60)
      ) {
        return NextResponse.json(
          { error: "Verification email has already been sent." },
          { status: 400 },
        );
      }
    }

    // Generate new verification token
    const verificationToken = UserHelper.token.generateVerificationToken();
    const hashedToken = UserHelper.token.hashToken(verificationToken);
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    sendEmail(
      email,
      "Verify your email address",
      `
        <h1>Dear ${user.name},</h1>
        <p>Please use this link to verify your email:</p>
        <a href="${frontendUrl}/verify-email?token=${verificationToken}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>Dont share this link with anyone.</p>
      `,
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: tokenExpiry,
      },
    });

    return NextResponse.json(
      { message: "Verification email has been sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// NEW: Forgot Password (Request Reset)
export const forgotPassword = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
        passwordResetExpiry: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Email not found",
        },
        { status: 400 },
      );
    }

    if (user) {
      if (user.emailVerified === false) {
        return NextResponse.json(
          { error: "Email is not verified yet" },
          { status: 400 },
        );
      }
      if (
        user.passwordResetExpiry &&
        UserHelper.isTimePassed(user.passwordResetExpiry, 60, 10)
      ) {
        return NextResponse.json(
          { error: "Password reset key is resent every 10 minutes." },
          { status: 400 },
        );
      }
    }

    // Generate password reset token
    const resetToken = UserHelper.token.generateVerificationToken();
    const hashedToken = UserHelper.token.hashToken(resetToken);
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    sendEmail(
      email,
      "Reset your password",
      `
        <h1>Dear ${user.name},</h1>
        <p>Please use this key to reset your password:</p>
        <p>Please use this link to verify your email:</p>
        <a href="${frontendUrl}/reset_password?token=${resetToken}&email=${email}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>Dont share this link with anyone.</p>
      `,
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpiry: tokenExpiry,
      },
    });

    // Send password reset email

    return NextResponse.json(
      { message: "If the email exists, a password reset link has been sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// NEW: Reset Password (Complete Reset)
export const resetPassword = async (req: NextRequest) => {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !newPassword || !email) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 },
      );
    }

    // Validate password
    const validatePassword = UserHelper.validatePassword(newPassword);
    if (!validatePassword.success) {
      return NextResponse.json(
        { error: validatePassword.message },
        { status: 400 },
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = UserHelper.token.hashToken(token);

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        email,
        passwordResetToken: hashedToken,
        passwordResetExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = (await UserHelper.hashPassword(newPassword))
      .hashedPassword;

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        refreshTokens: [], // Invalidate all sessions
      },
    });

    return NextResponse.json(
      {
        message:
          "Password reset successful. You can now log in with your new password.",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const logoutUser = async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const id = req.headers.get("x-user-id");

  if (refreshToken) {
    const hashedToken = UserHelper.token.hashToken(refreshToken);

    // Get current tokens and update in one operation
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { refreshTokens: true },
    });

    if (user?.refreshTokens) {
      await prisma.user.update({
        where: { id: Number(id) },
        data: {
          refreshTokens: user.refreshTokens.filter((t) => t !== hashedToken),
        },
      });
    }
  }

  const res = NextResponse.json({ message: "Logged out successfully" });
  const cookieOptions = {
    httpOnly: true,
    path: "/api",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    expires: new Date(0),
  };

  res.cookies.set("accessToken", "", cookieOptions);
  res.cookies.set("refreshToken", "", cookieOptions);
  return res;
};

export const logoutAllDevices = async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id");

  await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      refreshTokens: [], // Clear all tokens
    },
  });

  const res = NextResponse.json({ message: "Logged out from all devices" });
  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");
  return res;
};
