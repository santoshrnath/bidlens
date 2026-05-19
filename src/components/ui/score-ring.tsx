"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScoreRing({
  value,
  size = 96,
  stroke = 8,
  label = "/10",
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(10, value));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (v / 10) * circ;
  const color =
    v >= 8 ? "#10b981" : v >= 6.5 ? "#3b82f6" : v >= 5 ? "#f59e0b" : "#ef4444";
  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#eef0f4"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center leading-none">
          <span className="text-[20px] font-semibold tabular-nums text-ink-900">
            {v.toFixed(1)}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-400">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
