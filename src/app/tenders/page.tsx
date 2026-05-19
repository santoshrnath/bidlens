import Link from "next/link";
import { listTenders } from "@/lib/data";
import { StageBadge } from "@/components/ui/stage-badge";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { fmtDate, fmtMoney } from "@/lib/utils";
import { Plus, ArrowUpRight, Filter, Download, Upload } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TendersPage() {
  const tenders = await listTenders();
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h-title">Tenders</h1>
          <p className="h-sub mt-1">
            Every live tender, with stage, bidder count and risk posture at a glance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-ghost">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="btn-ghost">
            <Upload className="h-4 w-4" /> Import RFP
          </button>
          <button className="btn-ghost">
            <Download className="h-4 w-4" /> Export
          </button>
          <Link href="/tenders/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New tender
          </Link>
        </div>
      </header>

      <div className="rounded-2xl border border-ink-200/70 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink-200/70 text-sm">
            <thead className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-5 py-3">Tender</th>
                <th className="px-5 py-3">Stage</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Bids</th>
                <th className="px-5 py-3">Risks</th>
                <th className="px-5 py-3">Closing</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/70">
              {tenders.map((t) => (
                <tr key={t.id} className="group transition hover:bg-canvas-50">
                  <td className="px-5 py-4">
                    <Link href={`/tenders/${t.id}`} className="flex flex-col">
                      <span className="font-semibold text-ink-900">{t.name}</span>
                      <span className="text-[11px] text-ink-500">
                        {t.reference ?? "—"} · {t.category ?? "Uncategorised"}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <StageBadge stage={t.stage} />
                  </td>
                  <td className="px-5 py-4 tabular-nums text-ink-700">
                    {fmtMoney(t.budget, t.currency, true)}
                  </td>
                  <td className="px-5 py-4">
                    {t.bids.length ? (
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
                        {t.bids.length > 4 ? (
                          <span className="ml-2 grid h-[22px] w-[22px] place-items-center rounded-lg bg-ink-100 text-[10px] font-semibold text-ink-600 ring-2 ring-white">
                            +{t.bids.length - 4}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-[12px] text-ink-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {t._count.risks ? (
                      <span className="pill-amber">{t._count.risks} risks</span>
                    ) : (
                      <span className="pill">No flags</span>
                    )}
                  </td>
                  <td className="px-5 py-4 tabular-nums text-ink-600">
                    {fmtDate(t.closingAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/tenders/${t.id}`}
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-violet-600 transition group-hover:text-violet-700"
                    >
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {tenders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-ink-500">
                    No tenders yet — create one from the button above.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
