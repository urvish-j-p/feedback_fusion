"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ReactNode } from "react";

interface SubmitFeedbackButtonProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function SubmitFeedbackButton({ children, className, size = "lg" }: SubmitFeedbackButtonProps) {
  const { userId } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!userId) {
      e.preventDefault();
      toast.error("Please sign in to submit feedback.");
      router.push("/sign-in");
      return;
    }
    router.push("/feedback/new");
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}
