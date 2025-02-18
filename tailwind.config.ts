import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-gabarito)", ...fontFamily.sans],
        body: ["var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        // System colors using HSL
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // UI component base colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Custom semantic colors
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          focused: "var(--bg-focused)",
          disabled: "var(--bg-disabled)",
          error: {
            primary: "var(--bg-error-primary)",
            secondary: "var(--bg-error-secondary)",
            solid: "var(--bg-error-solid)",
          },
          warning: {
            primary: "var(--bg-warning-primary)",
            secondary: "var(--bg-warning-secondary)",
            solid: "var(--bg-warning-solid)",
          },
          success: {
            primary: "var(--bg-success-primary)",
            secondary: "var(--bg-success-secondary)",
          },
        },

        // Border colors
        "border-primary": "var(--border-primary)",
        "border-secondary": "var(--border-secondary)",
        "border-tertiary": "var(--border-tertiary)",
        "border-disabled": "var(--border-disabled)",
        "border-disabled-subtle": "var(--border-disabled-subtle)",
        "border-brand": "var(--border-brand)",
        "border-error": "var(--border-error)",

        // Text colors
        text: {
          primary: "var(--text-primary)",
          white: "var(--text-white)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
          placeholder: "var(--text-placeholder)",
          success: {
            primary: "var(--text-success-primary)",
          },
          error: {
            primary: "var(--text-error-primary)",
          },
        },

        // Button colors
        button: {
          primary: {
            bg: "var(--button-primary-bg)",
            "bg-hover": "var(--button-primary-bg-hover)",
            text: "var(--button-primary-text)",
            "fg-hover": "var(--button-primary-fg-hover)",
          },
          secondary: {
            bg: "var(--button-secondary-bg)",
            "bg-hover": "var(--button-secondary-bg-hover)",
            text: "var(--button-secondary-text)",
            "text-hover": "var(--button-secondary-text-hover)",
          },
          clink: "var(--button-clink)",
          "clink-hover": "var(--button-clink-hover)",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

export default config;
