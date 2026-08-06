import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./button";
import { MoonIcon, SunIcon } from "lucide-react";

function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon
        className={
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        }
      />
      <MoonIcon
        className={
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        }
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ModeToggle;
