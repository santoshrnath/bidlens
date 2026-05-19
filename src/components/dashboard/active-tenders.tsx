"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, AlertTriangle, FileText, Users } from "lucide-react";
import { StageBadge } from "@/components/ui/stage-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { fmtDate } from "@/lib/utils";

export function ActiveTenders({
  tenders,
}: {
  tenders: Array<{
    id: string;
    name: string;
    reference: string | null;
    stage: string;
    closingAt: Date | null;
    bids: Array<{ id: string; vendorName: string; accentColor: string | null; isRecommended: boolean; overallScore: number | null }>;
    _count: { bids: number; risks: number };
  }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {tenders.map((t, i) => {
        const bestScore =
          t.bids.reduce((m, b) => Math.max(m, b.overallScore ?? 0), 0) || 0;
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
          >
            <Link
              href={`/tenders/${t.id}`}
              className="group block rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                    {t.reference ?? "Tender"}
                  </p>
                  <h3 className="mt-1 font-display text-[17px] font-semibold leading-tight text-ink-900">
                    {t.name}
                  </h3>
                </div>
                <ArrowUpRight className="h-4 w-4 text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600" />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <StageBadge stage={t.stage} />
                {t.closingAt ? (
                  <span className="pill">
                    Closes {fmtDate(t.closingAt)}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
                <Mini label="Bids" value={String(t._count.bids)} icon={Users} />
                <Mini label="Risks" value={String(t._count.risks)} icon={AlertTriangle} />
                <Mini label="Best score" value={bestScore ? bestScore.toFixed(1) : "—"} icon={FileText} />
              </div>

              <div className="mt-4">
                <ProgressBar
                  value={bestScore}
                  color={bestScore >= 8 ? "emerald" : bestScore >= 6.5 ? "sky" : "amber"}
                />
              </div>

              {t.bids.length > 0 ? (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {t.bids.slice(0, 4).map((b) => (
                      <VendorAvatar
                        key={b.id}
                        name={b.vendorName}
                        color={b.accentColor}
                        size={22}
                        className="ring-2 ring-white"
                      />
                    ))}
                  </div>
                  {t.bids.length > 4 ? (
                    <span className="text-[11px] text-ink-500">+{t.bids.length - 4} more</span>
                  ) : null}
                </div>
              ) : null}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

function Mini({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="rounded-xl border border-ink-200/70 bg-canvas-50 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-400">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-0.5 text-[14px] font-semibold tabular-nums text-ink-900">
        {value}
      </div>
    </div>
  );
}
