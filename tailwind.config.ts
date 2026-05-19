import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          50: "#fafbfc",
          100: "#f5f6f8",
          200: "#eef0f4",
          300: "#dde1e8",
        },
        violet: {
          50: "#f6f3ff",
          100: "#ede7ff",
          200: "#d8ccff",
          300: "#b9a4ff",
          400: "#9776ff",
          500: "#7c5cff",
          600: "#6d44ff",
          700: "#5a32e8",
          800: "#4a28bd",
          900: "#3d2497",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#070b18",
        },
        risk: {
          high: "#ef4444",
          med: "#f59e0b",
          low: "#10b981",
          info: "#3b82f6",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(ellipse 70% 60% at 80% -10%, rgba(124,92,255,0.08), transparent), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(124,92,255,0.05), transparent)",
        "grid-faint":
          "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 1px 0 rgba(15,23,42,0.02)",
        lift: "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px -8px rgba(15,23,42,0.12), 0 2px 4px -2px rgba(15,23,42,0.06)",
        ring: "0 0 0 1px rgba(124,92,255,0.18), 0 8px 32px -12px rgba(124,92,255,0.35)",
        focus: "0 0 0 4px rgba(124,92,255,0.18)",
      },
      borderRadius: {
        xl: "0.85rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
