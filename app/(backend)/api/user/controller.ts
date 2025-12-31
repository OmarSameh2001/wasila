import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../_lib/prisma";
import UserHelper from "../../_lib/user";
import { filterPrisma } from "../../_lib/filtering";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

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
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    if (type !== "USER" || type !== "BROKER") {
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

    const createdUser = await prisma.user.create({
      data: {
        email,
        password,
        name,
        username,
        type: "BROKER",
      },
    });

    // Generate token

    const token = generateAccessToken(createdUser);

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
        token,
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

// Get User by ID
// export const getUserById = async (req: NextRequest, userId: number) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         message: "User fetched successfully",
//         user,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Get user error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

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
