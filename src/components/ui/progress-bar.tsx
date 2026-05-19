"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 10,
  color = "violet",
  className,
  trackClassName,
}: {
  value: number;
  max?: number;
  color?: "violet" | "emerald" | "amber" | "sky" | "rose";
  className?: string;
  trackClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    color === "violet"
      ? "bg-gradient-to-r from-violet-500 to-violet-400"
      : color === "emerald"
      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
      : color === "amber"
      ? "bg-gradient-to-r from-amber-500 to-amber-400"
      : color === "rose"
      ? "bg-gradient-to-r from-rose-500 to-rose-400"
      : "bg-gradient-to-r from-sky-500 to-sky-400";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-100", trackClassName, className)}>
      <motion.div
        className={cn("h-full rounded-full", fill)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}
