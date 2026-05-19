"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Wand2,
  AlertTriangle,
  MessageSquareWarning,
  CheckCircle2,
  Upload,
  PencilLine,
  ClipboardCheck,
  Award,
  ScrollText,
  Users,
} from "lucide-react";
import { fmtRelative, cn } from "@/lib/utils";

const ICONS: Record<string, { icon: any; ring: string; bg: string; text: string }> = {
  RFP_UPLOADED: { icon: Upload, ring: "ring-sky-200", bg: "bg-sky-50", text: "text-sky-700" },
  SCHEMA_GENERATED: { icon: Wand2, ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700" },
  SCHEMA_EDITED: { icon: PencilLine, ring: "ring-ink-200", bg: "bg-ink-50", text: "text-ink-700" },
  SCHEMA_APPROVED: { icon: ClipboardCheck, ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" },
  BID_UPLOADED: { icon: FileText, ring: "ring-sky-200", bg: "bg-sky-50", text: "text-sky-700" },
  BID_EXTRACTED: { icon: Wand2, ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700" },
  RISK_FLAGGED: { icon: AlertTriangle, ring: "ring-rose-200", bg: "bg-rose-50", text: "text-rose-700" },
  CLARIFICATION_RAISED: { icon: MessageSquareWarning, ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
  CLARIFICATION_ANSWERED: { icon: CheckCircle2, ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" },
  SCORE_SUBMITTED: { icon: ClipboardCheck, ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700" },
  WEIGHTING_CHANGED: { icon: PencilLine, ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
  COMMITTEE_INVITED: { icon: Users, ring: "ring-sky-200", bg: "bg-sky-50", text: "text-sky-700" },
  AWARD_RECOMMENDED: { icon: Award, ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" },
  AWARD_APPROVED: { icon: Award, ring: "ring-emerald-300", bg: "bg-emerald-100", text: "text-emerald-800" },
  DEFENSIBILITY_PACK_EXPORTED: { icon: ScrollText, ring: "ring-ink-200", bg: "bg-ink-50", text: "text-ink-700" },
  TENDER_CREATED: { icon: FileText, ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700" },
};

export function ActivityFeed({
  entries,
}: {
  entries: Array<{
    id: string;
    action: string;
    actor: string;
    actorRole?: string | null;
    target?: string | null;
    summary: string;
    createdAt: Date;
    tender?: { name: string; id: string; reference: string | null } | null;
  }>;
}) {
  return (
    <ol className="space-y-2">
      {entries.map((e, i) => {
        const meta = ICONS[e.action] ?? ICONS.TENDER_CREATED;
        const Icon = meta.icon;
        return (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-ink-200/70 hover:bg-canvas-50"
          >
            <span
              className={cn(
                "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1",
                meta.bg,
                meta.text,
                meta.ring,
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink-900">
                {e.summary}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-500">
                {e.actor}
                {e.actorRole ? ` · ${e.actorRole}` : ""}
                {e.tender ? ` · ${e.tender.name}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-[11px] text-ink-400">
              {fmtRelative(e.createdAt)}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}
