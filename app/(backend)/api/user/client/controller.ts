import { handlePrismaError } from "@/app/(backend)/_lib/errors";
import { filterPrisma, handleUrl } from "@/app/(backend)/_lib/filtering";
import { prisma } from "@/app/(backend)/_lib/prisma";
import UserHelper from "@/app/(backend)/_lib/user";
import { NextRequest, NextResponse } from "next/server";

export const addNewClient = async (
  req: NextRequest,
  userId: number,
  userType: string,
) => {
  try {
    const { name, email, username, leadSource, contactInfo } = await req.json();

    if (!name || !username) {
      return NextResponse.json(
        { error: "Please provide name and username" },
        { status: 400 },
      );
    }

    const repeatedClient = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (repeatedClient) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 },
      );
    }

    // placeholder because client cannot login without forgeting password to updated to user
    const hashedPassword = (await UserHelper.hashPassword("12345678@Wa"))
      .hashedPassword;
    const client = await prisma.user.create({
      data: {
        name,
        email,
        type: "CLIENT",
        ...(userType === "BROKER" && { brokerId: userId }),
        username:
          username || email.split("@")[0] + Math.floor(Math.random() * 1000),
        password: hashedPassword,
        leadSource,
        contactInfo,
      },
    });

    return NextResponse.json(
      {
        message: "New client added successfully",
        client,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Add new client error:", error);
    return handlePrismaError(error);
  }
};

// Change User Type (Admin and creator broker only)
export const changeClient = async (
  req: NextRequest,
  userId: number,
  type: string,
  clientId: number,
) => {
  try {
    const {
      type: clientType,
      name,
      email,
      username,
      leadSource,
      contactInfo,
    } = await req.json();

    const user = await prisma.user.update({
      where: {
        id: clientId,
        type: "CLIENT",
        ...(type === "BROKER" && { brokerId: userId }),
      },
      data: {
        name,
        email,
        username,
        leadSource,
        contactInfo,
        ...(type === "ADMIN" && { type: clientType }),
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Client type client successfully",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change client error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const deleteClient = async (
  req: NextRequest,
  userId: number,
  type: string,
  clientId: number,
) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: clientId,
        type: "CLIENT",
        ...(type === "BROKER" && { brokerId: userId }),
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Client deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete client error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const getClientById = async (
  req: NextRequest,
  userId: number,
  type: string,
  clientId: number,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: clientId,
        type: "CLIENT",
        ...(type === "BROKER" && { brokerId: userId }),
      },
      select: {
        ...(type === "ADMIN" && {
          broker: { select: { id: true, name: true } },
        }),
        createdAt: true,
        email: true,
        name: true,
        username: true,
        // records: true,
        contactInfo: true,
        clientCount: true,
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

export const getAllClients = async (
  req: NextRequest,
  userId: number,
  type: string,
) => {
  try {
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(
      parseInt(url.searchParams.get("limit") || "10", 10),
      1,
    );

    const params = handleUrl(url, "user") || {};
    params.type = "CLIENT";
    if (type === "BROKER") {
      params.brokerId = userId;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { ...params },
        select: {
          email: true,
          id: true,
          name: true,
          username: true,
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

export async function searchClient(
  req: NextRequest,
  userId: number,
  type: string,
) {
  try {
    const url = new URL(req.url);
    return await filterPrisma(
      prisma.user,
      1,
      10,
      {
        ...(type === "BROKER" && { brokerId: userId }),
        type: { in: ["USER", "CLIENT"] },
      },
      url,
      "user",
      {},
      { name: true, id: true, username: true },
    );
  } catch (error) {}
}
