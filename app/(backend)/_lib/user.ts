import "server-only";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../_lib/prisma";
import { UserBackend } from "./dto";

const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = async (
  password: string
): Promise<{ success: boolean; hashedPassword: string }> => {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return { success: true, hashedPassword };
  } catch (error) {
    console.error("Hash password error:", error);
    return { success: false, hashedPassword: "" };
  }
};

const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isPasswordMatch = await bcryptjs.compare(password, hashedPassword);
    return isPasswordMatch;
  } catch (error) {
    console.error("Compare password error:", error);
    return false;
  }
};

const validateEmail = (
  email: string
): { success: boolean; value?: string; message?: string } => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (emailRegex.test(email)) {
    return { success: true, value: email };
  }
  return { success: false, message: "Invalid email format" };
};

const validatePassword = (
  password: string
): { success: boolean; value?: string; message?: string } => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%\^&*])[A-Za-z\d!@#$%\^&*]{8,20}$/;
  if (passwordRegex.test(password)) {
    return { success: true, value: password };
  }
  return {
    success: false,
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  };
};

const isTimePassed = (
  date: Date,
  addedTime: number,
  minTime: number
): boolean => {
  const addedTimeMs = addedTime * 60 * 1000;
  const minTimeMs = minTime * 60 * 1000;
  const now = Date.now();
  const createdAt = date.getTime() - addedTimeMs;
  return now - createdAt >= minTimeMs;
};

const verifyRefreshToken = (refreshToken: string) => {
  if (!refreshToken) return null;
  
  try {
    return jwt.verify(refreshToken, JWT_SECRET!) as unknown as { id: string };
  } catch (error) {
    console.error("Verify refresh token error:", error);
    return null;
  }
};

const returnRefreshedUser = async (
  refreshToken: string
): Promise<UserBackend | null> => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(decoded.id) },
    select: {
      id: true,
      type: true,
      refreshTokens: true,
    },
  });

  if (!user || user?.refreshTokens?.length === 0) return null;

  const hashedToken = hashToken(refreshToken);
  if (!user.refreshTokens.includes(hashedToken)) return null;

  return user as UserBackend;
};
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateRefreshToken = (user: UserBackend) => {
  return jwt.sign({ id: user.id.toString() }, JWT_SECRET!, { expiresIn: "7d" });
};

// Generate JWT Token
const generateAccessToken = (user: UserBackend): string => {
  return jwt.sign(
    {
      id: user.id.toString(),
      type: user.type,
    },
    JWT_SECRET!,
    { expiresIn: "1d" }
  );
};
const UserHelper = {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword,
  isTimePassed,
  token: {
    verifyRefreshToken,
    generateVerificationToken,
    hashToken,
    generateRefreshToken,
    generateAccessToken,
    returnRefreshedUser,
  },
};

export default UserHelper;
