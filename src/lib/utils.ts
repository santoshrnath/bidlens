import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name?: string | null): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}

export function fmtNumber(n: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    ...opts,
  }).format(n);
}

export function fmtMoney(
  n: number | null | undefined,
  currency = "USD",
  compact = false,
): string {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(n);
}

export function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtRelative(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d ago`;
  const mo = Math.round(days / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function toArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  return [];
}

export function pct(part: number, whole: number, dp = 0): string {
  if (!whole) return "0%";
  return `${((part / whole) * 100).toFixed(dp)}%`;
}

export function scoreColor(value: number | null | undefined): {
  text: string;
  bg: string;
  ring: string;
} {
  if (value == null) return { text: "text-ink-400", bg: "bg-ink-100", ring: "ring-ink-200" };
  if (value >= 8) return { text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" };
  if (value >= 6.5) return { text: "text-sky-700", bg: "bg-sky-50", ring: "ring-sky-200" };
  if (value >= 5) return { text: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200" };
  return { text: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-200" };
}

export function severityColor(sev: string): {
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (sev.toUpperCase()) {
    case "HIGH":
      return {
        text: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        dot: "bg-rose-500",
      };
    case "MEDIUM":
      return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };
    case "LOW":
      return {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
      };
    default:
      return {
        text: "text-sky-700",
        bg: "bg-sky-50",
        border: "border-sky-200",
        dot: "bg-sky-500",
      };
  }
}
