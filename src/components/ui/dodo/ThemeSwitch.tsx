/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import AnimatedIconButton from "@/components/custom/animated-icon";

const ThemeSwitch = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!(document as any).startViewTransition) {
      setTheme(resolvedTheme === "light" ? "dark" : "light");
      return;
    }

    (document as any).startViewTransition(() => {
      setTheme(resolvedTheme === "light" ? "dark" : "light");
    });
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="relative"
    >
      <div className="relative z-10">
        {resolvedTheme === "light" ? (
          <AnimatedIconButton>
            <Moon className="w-5 h-5 hover:rotate-[360deg] duration-1000 ease-in-out" />
          </AnimatedIconButton>
        ) : (
          <AnimatedIconButton>
            <Sun className="w-5 h-5 hover:rotate-[360deg] duration-1000 ease-in-out" />
          </AnimatedIconButton>
        )}
      </div>
    </button>
  );
};

export default ThemeSwitch;
