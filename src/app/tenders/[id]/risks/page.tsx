import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { RiskBadge } from "@/components/ui/risk-badge";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { Sparkles, FileText, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RisksPage({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  if (!tender) notFound();

  const all = tender.bids.flatMap((b) =>
    b.risks.map((r) => ({ ...r, bidName: b.vendorName, bidColor: b.accentColor })),
  );
  const order: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0 };
  const sorted = [...all].sort((a, b) => order[b.severity] - order[a.severity]);

  // Build risk-heatmap matrix: rows = categories, cols = bids
  const categories = Array.from(new Set(sorted.map((r) => r.category)));
  const sevCell = (cat: string, bidName: string): "HIGH" | "MEDIUM" | "LOW" | "INFO" | null => {
    const flags = all.filter((r) => r.category === cat && r.bidName === bidName);
    if (!flags.length) return null;
    return flags.reduce<any>(
      (acc, r) => (order[r.severity] > order[acc] ? r.severity : acc),
      "INFO",
    );
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
        <header className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-900">
              Risk heatmap
            </h2>
            <p className="text-[12px] text-ink-500">
              Each cell shows the worst-severity flag for that category and vendor. AI surfaced; humans decide.
            </p>
          </div>
          <span className="pill-violet">
            <Sparkles className="h-3 w-3" /> {all.length} flags · {all.filter(r => r.severity === "HIGH").length} high
          </span>
        </header>
        <div className="overflow-x-auto rounded-xl border border-ink-200/70">
          <table className="min-w-full divide-y divide-ink-200/70 text-sm">
            <thead className="bg-canvas-50/60 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3">Category</th>
                {tender.bids.map((b) => (
                  <th key={b.id} className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <VendorAvatar name={b.vendorName} color={b.accentColor} size={20} />
                      <span className="truncate">{b.vendorShortName ?? b.vendorName}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/70">
              {categories.map((c) => (
                <tr key={c}>
                  <th className="bg-canvas-50/40 px-4 py-3 text-left text-[12.5px] font-semibold text-ink-800">
                    {c}
                  </th>
                  {tender.bids.map((b) => {
                    const sev = sevCell(c, b.vendorName);
                    return (
                      <td key={b.id} className="px-4 py-3">
                        {sev ? (
                          <RiskBadge severity={sev} size="sm" />
                        ) : (
                          <span className="text-[11px] text-ink-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <header>
          <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-900">
            Risk register
          </h2>
          <p className="text-[12px] text-ink-500">
            Each flag links to a source quote with page reference. Resolve, request a clarification, or accept the risk.
          </p>
        </header>
        <ul className="space-y-3">
          {sorted.map((r) => (
            <li
              key={r.id}
              className="overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-soft"
            >
              <div className="flex items-start justify-between gap-3 border-b border-ink-200/70 bg-canvas-50/50 px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <VendorAvatar name={r.bidName} color={r.bidColor} size={24} />
                  <div>
                    <p className="text-[13px] font-semibold text-ink-900">
                      {r.title}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {r.bidName} · {r.category} · {r.clauseRef ?? "no ref"}
                    </p>
                  </div>
                </div>
                <RiskBadge severity={r.severity} />
              </div>
              <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    Vendor position
                  </p>
                  <blockquote className="mt-1.5 rounded-xl border border-ink-200/70 bg-canvas-50 px-3.5 py-3 text-[12.5px] italic leading-snug text-ink-700">
                    “{r.vendorPosition ?? r.description}”
                  </blockquote>
                  {r.pageRef ? (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-ink-500">
                      <FileText className="h-3 w-3" /> {r.pageRef}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    Schema requirement
                  </p>
                  <div className="mt-1.5 rounded-xl border border-violet-200 bg-violet-50/60 px-3.5 py-3 text-[12.5px] leading-snug text-ink-800">
                    <ShieldAlert className="mb-1 inline h-3.5 w-3.5 text-violet-600" />{" "}
                    {r.schemaRequirement ?? "Refer to RFP for the applicable requirement."}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button className="btn-ghost text-[12px]">Raise clarification</button>
                    <button className="btn-ghost text-[12px]">Accept risk</button>
                    <button className="btn-primary text-[12px]">Add to register</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
