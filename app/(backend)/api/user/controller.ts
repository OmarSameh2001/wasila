import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../_lib/prisma";
import UserHelper from "../../_lib/user";
import { filterPrisma } from "../../_lib/filtering";
import crypto from "crypto";
import sendEmail from "../../_lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

export interface JWTPayload {
  id: string;
  type: "USER" | "ADMIN" | "BROKER";
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  password: string;
  type: string;
  brokerId: number | null;
  refreshToken: string | null;
}

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id.toString() }, JWT_SECRET, { expiresIn: "7d" });
};

// Generate JWT Token
export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id.toString(),
      type: user.type,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};
export const refreshAccessToken = async (req: NextRequest) => {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: {
        id: Number(decoded.id),
      },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 403 }
      );
    }

    const newAccessToken = generateAccessToken(user);

    const res = NextResponse.json(
      {
        message: "Access token refreshed successfully",
        user: {
          name: user.name,
          email: user.email,
          id: user.id,
          type: user.type,
          username: user.username,
        },
      },
      { status: 200 }
    );

    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Refresh token expired" },
      { status: 403 }
    );
  }
};

// Register User
export const registerUser = async (req: NextRequest) => {
  try {
    const { email, password, name, username, type } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
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
        { status: 409 }
      );
    }
    if (type !== "USER" && type !== "BROKER") {
      return NextResponse.json(
        { error: "Invalid user type you can only be user or broker" },
        { status: 400 }
      );
    }

    const validatePassword = UserHelper.validatePassword(password);
    if (!validatePassword.success) {
      return NextResponse.json(
        { error: validatePassword.message },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = (await UserHelper.hashPassword(password))
      .hashedPassword;

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const hashedToken = hashToken(verificationToken);
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Send email verification link
    sendEmail(
      email,
      "Welcome to wasila",
      `
        <h1>Welcome to wasila</h1>
        <p>Hello ${name},</p>
        <p>Please use this link to verify your email:</p>
        <a href="${frontendUrl}/verify-email?token=${verificationToken}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>Dont share this link with anyone.</p>
      `
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    // Find user and select password + refreshToken
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error:
            "Please verify your email before logging in. Check your inbox for the verification link.",
        },
        { status: 403 }
      );
    }

    // Compare passwords
    const isPasswordMatch = await UserHelper.comparePassword(
      password,
      user.password
    );
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
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
        accessToken,
      },
      { status: 200 }
    );

    // Set refresh token as httpOnly cookie ✅
    if (remember) {
      res.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/user/refresh",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api",
      maxAge: 1 * 24 * 60 * 60, // 1 day
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Get Current User
export const getCurrentUser = async (id: number) => {
  try {
    if (!id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const verifyEmail = async (req: NextRequest) => {
  try {
    const { token, email } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = hashToken(token);

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
        { status: 400 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
      // Don't reveal if user exists
      return NextResponse.json(
        { message: "Verification email has been sent." },
        { status: 200 }
      );
    }

    if (user) {
      if (user.emailVerified) {
        return NextResponse.json(
          { error: "Email is already verified" },
          { status: 400 }
        );
      }
      if (
        user.emailVerificationExpiry &&
        UserHelper.isTimePassed(user.emailVerificationExpiry, 24 * 60, 60)
      ) {
        return NextResponse.json(
          { error: "Verification email has already been sent." },
          { status: 400 }
        );
      }
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const hashedToken = hashToken(verificationToken);
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
      `
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        {
          message: "If the email exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    if (user) {
      if (!user.emailVerified) {
        return NextResponse.json(
          { error: "Email is not verified yet" },
          { status: 400 }
        );
      }
      if (
        user.passwordResetExpiry &&
        UserHelper.isTimePassed(user.passwordResetExpiry, 60, 10)
      ) {
        return NextResponse.json(
          { error: "Password reset key is resent every 10 minutes." },
          { status: 400 }
        );
      }
    }

    // Generate password reset token
    const resetToken = generateVerificationToken();
    const hashedToken = hashToken(resetToken);
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    sendEmail(
      email,
      "Reset your password",
      `
        <h1>Dear ${user.name},</h1>
        <p>Please use this key to reset your password:</p>
        <p>Please use this link to verify your email:</p>
        <a href="${frontendUrl}/reset_password?token=${resetToken}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>Dont share this link with anyone.</p>
      `
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    // Validate password
    const validatePassword = UserHelper.validatePassword(newPassword);
    if (!validatePassword.success) {
      return NextResponse.json(
        { error: validatePassword.message },
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = hashToken(token);

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
        { status: 400 }
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
        refreshToken: null, // Invalidate all sessions
      },
    });

    return NextResponse.json(
      {
        message:
          "Password reset successful. You can now log in with your new password.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
