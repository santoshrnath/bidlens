import { cn } from "@/lib/utils";

const STAGE_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  RFP_LOADED: "RFP loaded",
  SCHEMA_REVIEW: "Schema review",
  OPEN_FOR_BIDS: "Open for bids",
  IN_EVALUATION: "In evaluation",
  CLARIFICATIONS: "Clarifications",
  AWARD_RECOMMENDED: "Award recommended",
  AWARDED: "Awarded",
  CLOSED: "Closed",
};

const STAGE_COLOR: Record<string, string> = {
  DRAFT: "bg-ink-50 text-ink-600 border-ink-200",
  RFP_LOADED: "bg-sky-50 text-sky-700 border-sky-200",
  SCHEMA_REVIEW: "bg-violet-50 text-violet-700 border-violet-200",
  OPEN_FOR_BIDS: "bg-amber-50 text-amber-700 border-amber-200",
  IN_EVALUATION: "bg-violet-50 text-violet-700 border-violet-200",
  CLARIFICATIONS: "bg-amber-50 text-amber-700 border-amber-200",
  AWARD_RECOMMENDED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  AWARDED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CLOSED: "bg-ink-100 text-ink-700 border-ink-200",
};

export function StageBadge({ stage, className }: { stage: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        STAGE_COLOR[stage] ?? STAGE_COLOR.DRAFT,
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STAGE_LABEL[stage] ?? stage}
    </span>
  );
}
