import { severityColor, cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from "lucide-react";

const ICONS = {
  HIGH: AlertTriangle,
  MEDIUM: AlertCircle,
  LOW: CheckCircle2,
  INFO: Info,
} as const;

export function RiskBadge({
  severity,
  label,
  size = "md",
  className,
}: {
  severity: "HIGH" | "MEDIUM" | "LOW" | "INFO";
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const c = severityColor(severity);
  const Icon = ICONS[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        c.bg,
        c.text,
        c.border,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {label ?? labelFor(severity)}
    </span>
  );
}

function labelFor(s: string): string {
  return s === "HIGH"
    ? "High Risk"
    : s === "MEDIUM"
    ? "Medium"
    : s === "LOW"
    ? "Low"
    : "Info";
}

export function RiskDot({ severity }: { severity: string }) {
  const c = severityColor(severity);
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", c.dot)} />;
}
