import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Download, ShieldCheck, Hash } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditPage({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  if (!tender) notFound();

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white via-violet-50/60 to-white p-5 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-900">
              Defensibility pack
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-ink-600">
              The evaluation report, evidence archive, audit log and approver
              signatures, all bundled as a single ZIP. Export-ready format
              meets the documentation requirements of UAE Federal Procurement
              Law, KSA GTPL and the EU Public Procurement Directive.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/api/tenders/${tender.id}/defensibility-pack`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <ShieldCheck className="h-4 w-4" /> View hash chain
            </a>
            <a
              href={`/api/tenders/${tender.id}/defensibility-pack`}
              download
              className="btn-primary"
            >
              <Download className="h-4 w-4" /> Export pack
            </a>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Item label="Schema version" value={`v${tender.schema?.version ?? 1} · approved`} />
          <Item
            label="Evaluators submitted"
            value={`${tender.committee.filter((c) => c.hasSubmitted).length} of ${tender.committee.length}`}
          />
          <Item label="Audit entries" value={String(tender.audit.length)} />
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200/70 bg-white p-3 shadow-soft">
        <header className="flex items-center justify-between px-3 pb-1 pt-2">
          <h3 className="font-display text-[14px] font-semibold tracking-tight text-ink-900">
            Audit trail
          </h3>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-500">
            <Hash className="h-3 w-3" /> immutable · timestamped · user-attributed
          </span>
        </header>
        <ActivityFeed entries={tender.audit as any} />
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-200/70 bg-white px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="mt-0.5 text-[14px] font-semibold text-ink-900">{value}</p>
    </div>
  );
}
