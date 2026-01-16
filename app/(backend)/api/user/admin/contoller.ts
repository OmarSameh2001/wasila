import { filterPrisma, handleUrl } from "@/app/(backend)/_lib/filtering";
import { prisma } from "@/app/(backend)/_lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const getUserById = async (req: NextRequest, userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, type: "USER" },
      select: {
        createdAt: true,
        email: true,
        id: true,
        name: true,
        username: true,
        contactInfo: true,
        dob: true,
        broker: { select: { id: true, name: true } },
        records: { select: { id: true, issueDate: true, state: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User fetched successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const getBrokerById = async (req: NextRequest, userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, type: "BROKER" },
      select: {
        createdAt: true,
        email: true,
        id: true,
        name: true,
        username: true,
        contactInfo: true,
        dob: true,
        clients: { select: { id: true, name: true } },
        records: { select: { id: true, issueDate: true, state: true } },
        managedPolicies: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Broker fetched successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const getAllUsers = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(
      parseInt(url.searchParams.get("limit") || "10", 10),
      1
    );

    const params = handleUrl(url, "user") || {};
    if (!params.type) params.type = { in: ["USER", "CLIENT"] };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { ...params },
        select: {
          email: true,
          id: true,
          name: true,
          type: true,
          username: true,
          // dob: true,
          broker: { select: { id: true, name: true } },
          clientCount: true,
          leadSource: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.user.count({
        where: { ...params },
      }),
    ]);
    if (!users) {
      return NextResponse.json({ error: "Users not found" }, { status: 404 });
    }
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    return NextResponse.json(
      {
        message: "Users fetched successfully",
        users,
        totalPages,
        hasNextPage,
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

export const getAllBrokers = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const params = handleUrl(url, "user") || {};
    params.type = "BROKER";

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { ...params },
        select: {
          email: true,
          id: true,
          name: true,
          username: true,
          managedCount: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.user.count({
        where: { ...params },
      }),
    ]);
    if (!users) {
      return NextResponse.json({ error: "Brokers not found" }, { status: 404 });
    }
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    return NextResponse.json(
      {
        message: "Brokers fetched successfully",
        users,
        totalPages,
        hasNextPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get brokers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export async function searchUser(req: NextRequest, type: "BROKER" | "USER") {
  try {
    const url = new URL(req.url);
    type Role = "USER" | "CLIENT" | "BROKER";

    const newType: Role | { in: Role[] } =
      type === "USER" ? { in: ["USER", "CLIENT"] } : type;
      
    return await filterPrisma(
      prisma.user,
      1,
      10,
      { type: newType },
      url,
      "user",
      {},
      { name: true, id: true, username: true }
    );
  } catch (error) {}
}
