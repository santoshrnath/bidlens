import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StageBadge } from "@/components/ui/stage-badge";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { fmtDate } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EvaluationsPage() {
  const tenders = await prisma.tender.findMany({
    where: {
      stage: { in: ["IN_EVALUATION", "CLARIFICATIONS", "AWARD_RECOMMENDED"] },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      bids: {
        select: { id: true, vendorName: true, accentColor: true, overallScore: true, isRecommended: true },
      },
      committee: { select: { id: true, hasSubmitted: true } },
      _count: { select: { risks: true, clarifications: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6">
      <header>
        <h1 className="h-title">Evaluations</h1>
        <p className="h-sub mt-1">
          Live evaluations awaiting your input — score, raise clarifications, or approve.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {tenders.map((t) => {
          const submitted = t.committee.filter((c) => c.hasSubmitted).length;
          const total = t.committee.length || 1;
          const best = t.bids.reduce((m, b) => Math.max(m, b.overallScore ?? 0), 0);
          return (
            <Link
              key={t.id}
              href={`/tenders/${t.id}/scores`}
              className="group rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                    {t.reference}
                  </p>
                  <h3 className="mt-1 font-display text-[16px] font-semibold tracking-tight text-ink-900">
                    {t.name}
                  </h3>
                </div>
                <ArrowUpRight className="h-4 w-4 text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StageBadge stage={t.stage} />
                <span className="pill">Closes {fmtDate(t.closingAt)}</span>
                <span className="pill-amber">{t._count.risks} risks</span>
              </div>
              <div className="mt-4 grid gap-2 text-[12px]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Committee submitted</span>
                    <span className="font-semibold tabular-nums text-ink-900">
                      {submitted} / {total}
                    </span>
                  </div>
                  <ProgressBar value={(submitted / total) * 10} color="violet" className="mt-1" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Best score</span>
                    <span className="font-semibold tabular-nums text-ink-900">
                      {best ? best.toFixed(1) : "—"}
                    </span>
                  </div>
                  <ProgressBar value={best} color="emerald" className="mt-1" />
                </div>
              </div>
              <div className="mt-4 flex -space-x-1.5">
                {t.bids.slice(0, 5).map((b) => (
                  <VendorAvatar
                    key={b.id}
                    name={b.vendorName}
                    color={b.accentColor}
                    size={22}
                    className="ring-2 ring-white"
                  />
                ))}
                {t.bids.length > 5 ? (
                  <span className="ml-2 grid h-[22px] w-[22px] place-items-center rounded-lg bg-ink-100 text-[10px] font-semibold text-ink-600 ring-2 ring-white">
                    +{t.bids.length - 5}
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
