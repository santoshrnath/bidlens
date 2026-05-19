import { HeroCard } from "@/components/dashboard/hero-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ActiveTenders } from "@/components/dashboard/active-tenders";
import { StatCard } from "@/components/ui/stat-card";
import {
  ClipboardCheck,
  FileSpreadsheet,
  AlertTriangle,
  Users,
  ShieldCheck,
} from "lucide-react";
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const totalBids = data.tenders.reduce((s, t) => s + t.bids.length, 0);
  const totalRisks = data.risks.reduce((s, r) => s + r._count._all, 0);
  const highRisks = data.risks.find((r) => r.severity === "HIGH")?._count._all ?? 0;

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6">
      <HeroCard
        totalTenders={data.active}
        totalBids={totalBids}
        awarded={data.total - data.active}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active tenders"
          value={data.active}
          delta={{ dir: "up", value: "+2" }}
          hint="this month"
          accent="violet"
          icon={FileSpreadsheet}
          index={0}
        />
        <StatCard
          label="Open clarifications"
          value={data.clarifs}
          accent="amber"
          icon={ClipboardCheck}
          hint="across 3 tenders"
          index={1}
        />
        <StatCard
          label="High-risk flags"
          value={highRisks}
          delta={{ dir: "down", value: "-1" }}
          hint="vs last week"
          accent="amber"
          icon={AlertTriangle}
          index={2}
        />
        <StatCard
          label="Awaiting approval"
          value={data.approvals}
          accent="emerald"
          icon={ShieldCheck}
          hint="award packs"
          index={3}
        />
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <header className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-[18px] font-semibold tracking-tight text-ink-900">
                Active tenders
              </h2>
              <p className="text-[12px] text-ink-500">
                Move fast. Drill into any tender to see schema, bids, scores and risks.
              </p>
            </div>
          </header>
          <ActiveTenders tenders={data.tenders as any} />
        </div>

        <aside className="space-y-3">
          <header>
            <h2 className="font-display text-[18px] font-semibold tracking-tight text-ink-900">
              Recent activity
            </h2>
            <p className="text-[12px] text-ink-500">
              Every action is captured in the audit trail.
            </p>
          </header>
          <div className="rounded-2xl border border-ink-200/70 bg-white p-2 shadow-soft">
            <ActivityFeed entries={data.recentActivity as any} />
          </div>

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
            <div className="flex items-center gap-2 text-violet-700">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[12px] font-semibold uppercase tracking-wide">
                Defensibility
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-ink-700">
              {totalRisks} risk{totalRisks === 1 ? "" : "s"} surfaced across {data.total}{" "}
              tenders. Every flag links to source quote with page reference,
              and every decision is captured in an immutable audit trail.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-500">
              <Users className="h-3 w-3" />
              UAE Federal Procurement · KSA GTPL · EU Public Procurement
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
