"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Page() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen justify-center">
      <SignIn
        appearance={{
          baseTheme: theme === "light" ? dark : undefined,
        }}
      />
    </div>
  );
}