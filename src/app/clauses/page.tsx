import { listClauses } from "@/lib/data";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Library, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClausesPage() {
  const clauses = await listClauses();
  const grouped: Record<string, typeof clauses> = {};
  for (const c of clauses) {
    (grouped[c.category] ??= []).push(c);
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h-title">Clauses Library</h1>
          <p className="h-sub mt-1">
            Approved clause language across procurement categories. BidLens uses these as
            the baseline for deviation detection.
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" /> Add clause
        </button>
      </header>

      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, list]) => (
          <section
            key={cat}
            className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft"
          >
            <header className="flex items-center gap-2 pb-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
                <Library className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
                  {cat}
                </h2>
                <p className="text-[11px] text-ink-500">{list.length} clauses</p>
              </div>
            </header>
            <ul className="divide-y divide-ink-200/70">
              {list.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink-900">
                      {c.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-ink-600">
                      {c.body}
                    </p>
                  </div>
                  <RiskBadge severity={c.riskLevel as any} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
