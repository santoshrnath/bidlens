import { listVendors } from "@/lib/data";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { Star, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const vendors = await listVendors();
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h-title">Vendors</h1>
          <p className="h-sub mt-1">
            Approved supplier directory with bid history and win-rate.
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" /> Add vendor
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vendors.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-start gap-3">
              <VendorAvatar name={v.name} color={v.accentColor} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-display text-[15px] font-semibold tracking-tight text-ink-900">
                    {v.name}
                  </h3>
                  {v.rating ? (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                      <Star className="h-3 w-3 fill-current" />
                      {v.rating.toFixed(1)}
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-ink-500">
                  {v.category} · {v.country}
                </p>
              </div>
            </div>
            {v.notes ? (
              <p className="mt-3 text-[12.5px] leading-snug text-ink-600">
                {v.notes}
              </p>
            ) : null}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg border border-ink-200/70 bg-canvas-50 px-3 py-2">
                <p className="font-semibold uppercase tracking-wide text-ink-400">
                  Bids run
                </p>
                <p className="mt-0.5 text-[14px] font-semibold tabular-nums text-ink-900">
                  {v.bidsRun}
                </p>
              </div>
              <div className="rounded-lg border border-ink-200/70 bg-canvas-50 px-3 py-2">
                <p className="font-semibold uppercase tracking-wide text-ink-400">
                  Awards
                </p>
                <p className="mt-0.5 text-[14px] font-semibold tabular-nums text-ink-900">
                  {v.awardsWon}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
