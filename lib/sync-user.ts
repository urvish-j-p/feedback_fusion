import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function syncCurrentUser() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    let dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    });

    if (dbUser) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email,
          name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim(),
          image: clerkUser?.imageUrl,
        },
      });
    } else {
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;

      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim(),
          image: clerkUser.imageUrl,
          role: isFirstUser ? "admin" : "user",
        },
      });
    }

    return dbUser;
  } catch (error) {
    console.error("Error syncing user from Clerk:", error);
  }
}
