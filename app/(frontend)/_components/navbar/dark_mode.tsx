"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export function DarkToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
  console.log("Theme:", theme, "Resolved:", resolvedTheme);
  console.log("HTML class:", document.documentElement.className);
}, [theme, resolvedTheme]);

  if (!mounted) {
    return (
      <div className="w-6 h-6" /> // Placeholder to prevent layout shift
    );
  }

  return (
    <>
      {resolvedTheme === "dark" ? (
        <SunIcon
          className="h-6 w-6 cursor-pointer text-yellow-400 hover:text-yellow-300 transition-colors"
          onClick={() => setTheme("light")}
        />
      ) : (
        <MoonIcon
          className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => setTheme("dark")}
        />
      )}
    </>
  );
}