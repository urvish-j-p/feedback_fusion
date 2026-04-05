import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const { userId } = await auth();

  let isAdmin = false;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (user && user.role === "admin") {
      isAdmin = true;
    }
  }

  return <NavbarClient isAdmin={isAdmin} />;
}
