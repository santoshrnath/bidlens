import { prisma } from "@/lib/prisma";
import { fmtMoney } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [tenders, bids, risks, awards] = await Promise.all([
    prisma.tender.findMany({ select: { stage: true, budget: true, category: true } }),
    prisma.bid.count(),
    prisma.riskFlag.groupBy({ by: ["severity"], _count: { _all: true } }),
    prisma.awardRecommendation.count({ where: { status: "submitted" } }),
  ]);

  const totalBudget = tenders.reduce((s, t) => s + (t.budget ?? 0), 0);
  const byStage: Record<string, number> = {};
  for (const t of tenders) byStage[t.stage] = (byStage[t.stage] ?? 0) + 1;

  const byCategory: Record<string, number> = {};
  for (const t of tenders) byCategory[t.category ?? "Other"] = (byCategory[t.category ?? "Other"] ?? 0) + 1;

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6">
      <header>
        <h1 className="h-title">Reports</h1>
        <p className="h-sub mt-1">
          Procurement portfolio at a glance. Filter by category, owner or stage for the
          board pack.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total contract value"
          value={fmtMoney(totalBudget, "USD", true)}
          accent="violet"
          icon="chart"
          hint="across all tenders"
          index={0}
        />
        <StatCard
          label="Bids analysed"
          value={bids}
          accent="sky"
          icon="tenders"
          hint="YTD"
          index={1}
        />
        <StatCard
          label="High-risk flags"
          value={risks.find((r) => r.severity === "HIGH")?._count._all ?? 0}
          accent="amber"
          icon="alert"
          hint="open"
          index={2}
        />
        <StatCard
          label="Awards pending"
          value={awards}
          accent="emerald"
          icon="award"
          hint="committee approval"
          index={3}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <header className="mb-4">
            <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
              Tenders by stage
            </h2>
            <p className="text-[12px] text-ink-500">Where the portfolio sits right now.</p>
          </header>
          <ul className="space-y-2.5">
            {Object.entries(byStage).map(([stage, count]) => {
              const pct = (count / tenders.length) * 100;
              return (
                <li key={stage} className="grid grid-cols-[160px_1fr_40px] items-center gap-3">
                  <span className="truncate text-[12.5px] text-ink-700">
                    {readableStage(stage)}
                  </span>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-right text-[12px] font-semibold tabular-nums text-ink-900">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <header className="mb-4">
            <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
              Tenders by category
            </h2>
            <p className="text-[12px] text-ink-500">Volume mix across procurement categories.</p>
          </header>
          <ul className="space-y-2.5">
            {Object.entries(byCategory).map(([cat, count]) => {
              const pct = (count / tenders.length) * 100;
              return (
                <li key={cat} className="grid grid-cols-[160px_1fr_40px] items-center gap-3">
                  <span className="truncate text-[12.5px] text-ink-700">{cat}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-right text-[12px] font-semibold tabular-nums text-ink-900">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function readableStage(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/(^| )(.)/g, (_, p1, p2) => p1 + p2.toUpperCase());
}
