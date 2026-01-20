import 'server-only'
import { NextRequest, NextResponse } from "next/server";
import { filterPrisma, handleUrl } from "@/app/(backend)/_lib/filtering";
import { prisma } from "@/app/(backend)/_lib/prisma";
export const getBrokerById = async (
  req: NextRequest,
  userId: number,
  userType: string,
  brokerId: number,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: brokerId, type: "BROKER" },
      select: {
        createdAt: true,
        id: true,
        name: true,
        username: true,
        contactInfo: true,
        managedCount: true,

        ...(userType === "ADMIN" && { dob: true, email: true }),
        // clients: { select: { id: true, name: true } },
        // records: { select: { id: true, issueDate: true, state: true } },
        // managedPolicies: { select: { id: true, name: true } },
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
      { status: 200 },
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
export const getAllBrokers = async (
  req: NextRequest,
  userId: number,
  userType: string,
) => {
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
          id: true,
          name: true,
          username: true,
          managedCount: true,
          ...(userType === "ADMIN" && { email: true }),
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
      { status: 200 },
    );
  } catch (error) {
    console.error("Get brokers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
