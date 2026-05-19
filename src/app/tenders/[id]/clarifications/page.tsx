import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { fmtDate, cn } from "@/lib/utils";
import { ClarificationDraftButton } from "@/components/tender/clarification-draft-button";
import {
  Send,
  MessageCircle,
  CheckCircle2,
  PlusCircle,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClarificationsPage({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  if (!tender) notFound();

  return (
    <div className="space-y-5">
      {tender.clarifications.map((round) => (
        <section
          key={round.id}
          className="overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-soft"
        >
          <header className="flex items-center justify-between gap-3 border-b border-ink-200/70 bg-canvas-50/50 px-5 py-3.5">
            <div>
              <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
                Round {round.number} · Clarifications
              </h2>
              <p className="text-[11px] text-ink-500">
                Opened {fmtDate(round.openedAt)} · {round.items.length} items ·{" "}
                {round.items.filter((i) => i.status === "open").length} open
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ClarificationDraftButton tenderName={tender.name} />
              <button className="btn-primary text-[12px]">
                <PlusCircle className="h-3.5 w-3.5" /> New clarification
              </button>
            </div>
          </header>
          <ul className="divide-y divide-ink-200/70">
            {round.items.map((item) => (
              <li key={item.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <VendorAvatar
                        name={item.bid.vendorName}
                        color={item.bid.accentColor}
                        size={22}
                      />
                      <p className="text-[13px] font-semibold text-ink-900">
                        {item.bid.vendorName}
                      </p>
                      <span className="text-[11px] text-ink-500">·</span>
                      <p className="text-[11px] text-ink-500">
                        {item.schemaItemRef}
                      </p>
                    </div>
                    <div className="mt-2 flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-violet-50 text-violet-600">
                        <MessageCircle className="h-3 w-3" />
                      </span>
                      <p className="text-[13px] leading-relaxed text-ink-800">
                        {item.question}
                      </p>
                    </div>
                    {item.response ? (
                      <div className="mt-3 flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                          <Send className="h-3 w-3 -rotate-45" />
                        </span>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-800">
                          {item.response}
                          {Array.isArray(item.changedItems) && (item.changedItems as any[]).length ? (
                            <ul className="mt-2 space-y-1 text-[11px] text-ink-600">
                              {(item.changedItems as any[]).map((c, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="font-semibold">{c.ref}</span>
                                  <span className="line-through opacity-60">
                                    {c.before}
                                  </span>
                                  <span className="text-violet-600">→</span>
                                  <span className="font-semibold">{c.after}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                          <p className="mt-1.5 text-[11px] text-ink-500">
                            Responded {fmtDate(item.respondedAt)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <StatusPill status={item.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
        <div className="flex items-center gap-2 text-violet-700">
          <Sparkles className="h-4 w-4" />
          <span className="text-[12px] font-semibold uppercase tracking-wide">
            Diff-on-response
          </span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-700">
          When a vendor returns a clarification, BidLens diffs the response against the
          original bid and the prior round. Evaluators see exactly what changed before
          re-scoring.
        </p>
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "responded")
    return (
      <span className="pill-emerald">
        <CheckCircle2 className="h-3 w-3" /> Responded
      </span>
    );
  if (status === "closed") return <span className="pill">Closed</span>;
  return <span className="pill-amber">Open</span>;
}
