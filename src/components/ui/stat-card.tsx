"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardCheck,
  FileSpreadsheet,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  Award,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  clipboard: ClipboardCheck,
  tenders: FileSpreadsheet,
  alert: AlertTriangle,
  shield: ShieldCheck,
  chart: BarChart3,
  award: Award,
};

export function StatCard({
  label,
  value,
  delta,
  hint,
  accent = "violet",
  icon,
  index = 0,
}: {
  label: string;
  value: string | number;
  delta?: { dir: "up" | "down"; value: string };
  hint?: string;
  accent?: "violet" | "emerald" | "amber" | "sky";
  icon?: keyof typeof ICONS;
  index?: number;
}) {
  const Icon = icon ? ICONS[icon] : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft transition hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-ink-900">
            {value}
          </p>
        </div>
        {Icon ? (
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl",
              accent === "violet"
                ? "bg-violet-50 text-violet-600"
                : accent === "emerald"
                ? "bg-emerald-50 text-emerald-600"
                : accent === "amber"
                ? "bg-amber-50 text-amber-600"
                : "bg-sky-50 text-sky-600",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold tabular-nums",
              delta.dir === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700",
            )}
          >
            {delta.dir === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta.value}
          </span>
        ) : null}
        {hint ? <span className="text-ink-400">{hint}</span> : null}
      </div>
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/5 blur-2xl" />
    </motion.div>
  );
}
