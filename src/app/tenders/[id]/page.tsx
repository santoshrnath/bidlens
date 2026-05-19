import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { ScoreRing } from "@/components/ui/score-ring";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RiskBadge } from "@/components/ui/risk-badge";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { fmtMoney, fmtDate, toArray } from "@/lib/utils";
import { CheckCircle2, FileText, ListTree, ShieldCheck, Sparkles, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TenderOverview({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  if (!tender) notFound();

  const recommended = tender.bids.find((b) => b.isRecommended) ?? tender.bids[0];
  const totalRisks = tender.risks.length;
  const highRisks = tender.risks.filter((r) => r.severity === "HIGH").length;
  const openClarifs = tender.clarifications
    .flatMap((c) => c.items)
    .filter((i) => i.status === "open").length;

  const scope = toArray<any>(tender.schema?.scopeItems as any);
  const tcs = toArray<any>(tender.schema?.mandatoryTCs as any);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {/* Description + KPIs */}
        <section className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
          <p className="text-[13px] leading-relaxed text-ink-700">
            {tender.description ??
              "No description yet. Capture the procurement intent here so evaluators share context."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi label="Bidders" value={String(tender.bids.length)} icon={Users} />
            <Kpi label="Scope items" value={String(scope.length)} icon={ListTree} />
            <Kpi label="Risk flags" value={`${totalRisks}${highRisks ? ` · ${highRisks} high` : ""}`} icon={ShieldCheck} />
            <Kpi label="Open clarifications" value={String(openClarifs)} icon={FileText} />
          </div>
        </section>

        {/* Schema preview */}
        <section className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-900">
                Comparison schema
              </h2>
              <p className="text-[12px] text-ink-500">
                Generated from the RFP, edited and approved by procurement. Locked for evaluation.
              </p>
            </div>
            <span className="pill-violet">
              <Sparkles className="h-3 w-3" /> Schema v{tender.schema?.version ?? 1} · approved
            </span>
          </header>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {scope.map((s) => (
              <li
                key={s.id}
                className="flex items-start gap-3 rounded-xl border border-ink-200/70 bg-canvas-50 px-3.5 py-3"
              >
                <span className="grid h-6 w-12 shrink-0 place-items-center rounded-md bg-violet-50 text-[11px] font-semibold text-violet-700">
                  {s.code}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink-900">{s.title}</p>
                  <p className="text-[12px] leading-snug text-ink-500">{s.requirement}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] uppercase tracking-wide text-ink-400">
                    <span>Weight {s.weight}%</span>
                    {s.mandatory ? <span className="pill-rose">Mandatory</span> : <span className="pill">Optional</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Mandatory T&Cs */}
        <section className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
          <header>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-900">
              Mandatory T&amp;Cs
            </h2>
            <p className="text-[12px] text-ink-500">
              These clauses define the comparison baseline. Deviations are flagged automatically.
            </p>
          </header>
          <ul className="mt-4 divide-y divide-ink-200/70">
            {tcs.map((tc) => (
              <li key={tc.id} className="flex items-start justify-between gap-3 py-3.5">
                <div>
                  <p className="text-[13px] font-semibold text-ink-900">{tc.category}</p>
                  <p className="text-[12px] leading-snug text-ink-600">{tc.requirement}</p>
                </div>
                <span className="pill">{tc.sourceRef}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-5">
        {recommended ? (
          <section className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/40 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <span className="pill-emerald">
                <CheckCircle2 className="h-3 w-3" /> Recommended vendor
              </span>
              <span className="text-[11px] text-ink-500">Round 2 · Technical Evaluation</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <ScoreRing value={recommended.overallScore ?? 0} size={84} stroke={7} />
              <div className="min-w-0">
                <p className="truncate font-display text-[18px] font-semibold tracking-tight text-ink-900">
                  {recommended.vendorName}
                </p>
                <p className="text-[12px] text-ink-500">{recommended.complianceLevel}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              <ScoreLine label="Technical" value={recommended.scoreTechnical} color="violet" />
              <ScoreLine label="Commercial" value={recommended.scoreCommercial} color="sky" />
              <ScoreLine label="Delivery" value={recommended.scoreDelivery} color="emerald" />
              <ScoreLine label="Local content" value={recommended.scoreLocalContent} color="amber" />
            </div>
            <p className="mt-4 text-[12px] leading-snug text-ink-600">
              {tender.award?.rationale}
            </p>
            <div className="mt-4 flex items-center justify-between text-[12px]">
              <span className="text-ink-500">Contract value</span>
              <span className="font-semibold tabular-nums text-ink-900">
                {fmtMoney(tender.award?.contractValue ?? recommended.totalPrice, tender.currency, true)}
              </span>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <header className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-[14px] font-semibold tracking-tight text-ink-900">
              Committee
            </h3>
            <span className="text-[11px] text-ink-500">
              {tender.committee.filter((e) => e.hasSubmitted).length}/{tender.committee.length} submitted
            </span>
          </header>
          <ul className="space-y-2.5">
            {tender.committee.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-50 text-[11px] font-semibold text-violet-700">
                  {m.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink-900">
                    {m.fullName}
                  </p>
                  <p className="text-[11px] text-ink-500">{m.role}</p>
                </div>
                {m.hasSubmitted ? (
                  <span className="pill-emerald">Scored</span>
                ) : (
                  <span className="pill-amber">Pending</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-ink-200/70 bg-white p-2 shadow-soft">
          <header className="px-3 pb-1 pt-2">
            <h3 className="font-display text-[14px] font-semibold tracking-tight text-ink-900">
              Recent activity
            </h3>
          </header>
          <ActivityFeed entries={tender.audit.slice(0, 6) as any} />
        </section>
      </aside>
    </div>
  );
}

function Kpi({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-xl border border-ink-200/70 bg-canvas-50 px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-400">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-0.5 text-[18px] font-semibold tabular-nums text-ink-900">
        {value}
      </div>
    </div>
  );
}

function ScoreLine({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null | undefined;
  color: "violet" | "emerald" | "amber" | "sky";
}) {
  return (
    <div className="text-[12px]">
      <div className="flex items-center justify-between">
        <span className="text-ink-600">{label}</span>
        <span className="font-semibold tabular-nums text-ink-900">
          {value != null ? value.toFixed(1) : "—"}
        </span>
      </div>
      <ProgressBar value={value ?? 0} color={color} className="mt-1" />
    </div>
  );
}
