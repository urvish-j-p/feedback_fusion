import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ label, className }: { label?: string; className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={label ? "default" : "icon"}
      className={cn("cursor-pointer justify-start px-2", className)}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="relative h-5 w-5 flex items-center justify-center shrink-0">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      {label && <span className="ml-2 text-sm font-medium">{label}</span>}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}