import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        cyber: {
          blue: "#00d4ff",
          purple: "#9945ff",
          pink: "#ff0080",
          green: "#00ff88",
          orange: "#ff8800",
          dark: "#0a0b0d",
          "dark-light": "#1a1b1f",
          "dark-medium": "#2a2b2f",
          "dark-lighter": "#3a3b3f",
          "dark-lightest": "#4a4b4f",
          "blue-dark": "#0066ff",
          "blue-light": "#00ffff",
          "purple-dark": "#6600ff",
          "purple-light": "#cc00ff",
          "pink-dark": "#cc0066",
          "pink-light": "#ff66cc",
          "green-dark": "#00cc66",
          "green-light": "#66ffcc",
          "orange-dark": "#cc6600",
          "orange-light": "#ffcc66",
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
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 212, 255, 0.8)" },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 10px currentColor" },
          "50%": { textShadow: "0 0 20px currentColor" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(0, 212, 255, 0.5)" },
          "50%": { borderColor: "rgba(0, 212, 255, 0.8)" },
        },
        "background-glow": {
          "0%, 100%": { backgroundColor: "rgba(0, 212, 255, 0.1)" },
          "50%": { backgroundColor: "rgba(0, 212, 255, 0.2)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
        "border-glow": "border-glow 2s ease-in-out infinite",
        "background-glow": "background-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;
