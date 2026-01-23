import { prisma } from "../_lib/prisma";
import { cache } from "react";
import UserHelper from "../_lib/user";

export const getServerSideBroker = cache(async (id: number, token: string) => {
  try {
    // 1. Fetch user by ID first
    const user = await prisma.user.findUnique({
      where: { id, type: "BROKER" },
      select: {
        id: true,
        email: true,
        name: true,
        contactInfo: true,
        createdAt: true,
        managedCount: true,
        socialMedia: true,
        publicToken: true,
      },
    });

    if (!user) return null;

    // 2. Token Authorization Logic
    // If the DB has a token, the provided token MUST match.
    if (user.publicToken && user.publicToken !== token) {
      return null;
    }

    // 3. Auto-Generate Token if missing
    // This allows the first visit (or an admin) to initialize the QR token
    if (!user.publicToken) {
      const newToken = UserHelper.token.generateVerificationToken(6);
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { publicToken: newToken },
        // Keep selection consistent
        select: {
          id: true, email: true, name: true, contactInfo: true,
          createdAt: true, managedCount: true, socialMedia: true,
          publicToken: true,
        },
      });
      return updatedUser;
    }

    return user;
  } catch (error) {
    console.error("Server fetch error:", error);
    return null;
  }
});