import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { ScoreRing } from "@/components/ui/score-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { fmtMoney } from "@/lib/utils";
import { CheckCircle2, Crown } from "lucide-react";

export const dynamic = "force-dynamic";

const CRITERIA = [
  { key: "technical", label: "Technical", color: "violet" as const },
  { key: "commercial", label: "Commercial", color: "emerald" as const },
  { key: "delivery", label: "Delivery", color: "sky" as const },
  { key: "localContent", label: "Local Content", color: "amber" as const },
];

export default async function ScoresPage({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  if (!tender) notFound();

  const ordered = [...tender.bids].sort(
    (a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0),
  );

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {ordered.map((b, i) => (
          <div
            key={b.id}
            className="relative overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft"
          >
            {i === 0 ? (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                <Crown className="h-3 w-3" /> Lead
              </span>
            ) : null}
            <div className="flex items-center gap-3">
              <VendorAvatar name={b.vendorName} color={b.accentColor} size={32} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink-900">
                  {b.vendorName}
                </p>
                <p className="text-[11px] text-ink-500">{b.complianceLevel}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4">
              <ScoreRing value={b.overallScore ?? 0} size={88} stroke={7} />
              <div className="space-y-2">
                {CRITERIA.map((c) => {
                  const v =
                    c.key === "technical"
                      ? b.scoreTechnical
                      : c.key === "commercial"
                      ? b.scoreCommercial
                      : c.key === "delivery"
                      ? b.scoreDelivery
                      : b.scoreLocalContent;
                  return (
                    <div key={c.key} className="text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-500">{c.label}</span>
                        <span className="font-semibold tabular-nums text-ink-900">
                          {v != null ? v.toFixed(1) : "—"}
                        </span>
                      </div>
                      <ProgressBar value={v ?? 0} color={c.color} className="mt-0.5" />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink-200/70 pt-3 text-[12px]">
              <span className="text-ink-500">Total price</span>
              <span className="font-semibold tabular-nums text-ink-900">
                {fmtMoney(b.totalPrice ?? 0, b.currency ?? "USD", true)}
              </span>
            </div>
            {b.isRecommended ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Award-recommended
              </p>
            ) : null}
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
        <header className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-900">
              Evaluator scores · consolidated
            </h2>
            <p className="text-[12px] text-ink-500">
              Per-criterion mean across submitted evaluators. Individual scores remain
              private until the chair opens the consolidation step.
            </p>
          </div>
          <span className="pill-violet">{tender.committee.filter((c) => c.hasSubmitted).length} of {tender.committee.length} evaluators submitted</span>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink-200/70 text-sm">
            <thead className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-3 py-2">Vendor</th>
                {CRITERIA.map((c) => (
                  <th key={c.key} className="px-3 py-2">{c.label}</th>
                ))}
                <th className="px-3 py-2">Weighted total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/70">
              {ordered.map((b) => (
                <tr key={b.id}>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-2">
                      <VendorAvatar name={b.vendorName} color={b.accentColor} size={22} />
                      <span className="text-[13px] font-medium text-ink-800">
                        {b.vendorName}
                      </span>
                    </div>
                  </td>
                  {CRITERIA.map((c) => {
                    const v =
                      c.key === "technical"
                        ? b.scoreTechnical
                        : c.key === "commercial"
                        ? b.scoreCommercial
                        : c.key === "delivery"
                        ? b.scoreDelivery
                        : b.scoreLocalContent;
                    return (
                      <td key={c.key} className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-10 tabular-nums text-[13px] font-semibold text-ink-900">
                            {v != null ? v.toFixed(1) : "—"}
                          </span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-100">
                            <div
                              className={`h-full rounded-full ${
                                c.color === "violet"
                                  ? "bg-violet-500"
                                  : c.color === "emerald"
                                  ? "bg-emerald-500"
                                  : c.color === "sky"
                                  ? "bg-sky-500"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${((v ?? 0) / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3">
                    <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[13px] font-semibold tabular-nums text-violet-700">
                      {b.overallScore != null ? b.overallScore.toFixed(2) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
