import { prisma } from "@/lib/prisma";
import { getAuthContext, DEFAULT_TENANT } from "@/lib/auth-context";
import { fmtRelative } from "@/lib/utils";
import Link from "next/link";
import {
  Inbox as InboxIcon,
  AlertTriangle,
  ClipboardCheck,
  ShieldCheck,
  Award,
  Sparkles,
  MessageCircle,
  Send,
  FileText,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const KIND_META: Record<string, { icon: any; ring: string; bg: string; text: string; label: string }> = {
  RISK_FLAGGED: { icon: AlertTriangle, ring: "ring-rose-200", bg: "bg-rose-50", text: "text-rose-700", label: "Risk" },
  CLARIFICATION_DUE: { icon: MessageCircle, ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700", label: "Clarification due" },
  CLARIFICATION_RESPONDED: { icon: Send, ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", label: "Vendor responded" },
  SCORE_REQUESTED: { icon: ClipboardCheck, ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700", label: "Scoring" },
  APPROVAL_REQUESTED: { icon: ShieldCheck, ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700", label: "Approval" },
  AWARD_APPROVED: { icon: Award, ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", label: "Award" },
  BID_RECEIVED: { icon: FileText, ring: "ring-sky-200", bg: "bg-sky-50", text: "text-sky-700", label: "New bid" },
  BAFO_OPENED: { icon: Sparkles, ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700", label: "BAFO" },
  MENTIONED: { icon: MessageCircle, ring: "ring-ink-200", bg: "bg-ink-50", text: "text-ink-700", label: "Mention" },
};

export default async function InboxPage() {
  const ctx = await getAuthContext();
  const recipient = ctx.userId ?? DEFAULT_TENANT;

  const [notifications, openClarifs, pendingScores, pendingApprovals] = await Promise.all([
    prisma.notification.findMany({
      where: { recipient: { in: [recipient, DEFAULT_TENANT] } },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
    prisma.clarificationItem.findMany({
      where: { status: "open" },
      include: { bid: { select: { vendorName: true, accentColor: true, tenderId: true } } },
      take: 8,
    }),
    prisma.evaluator.findMany({
      where: { hasSubmitted: false },
      include: { tender: { select: { id: true, name: true, reference: true, closingAt: true } } },
      take: 8,
    }),
    prisma.approvalStep.findMany({
      where: { decision: "PENDING" },
      include: { award: { include: { tender: { select: { id: true, name: true, reference: true } } } } },
      orderBy: { order: "asc" },
      take: 8,
    }),
  ]);

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <InboxIcon className="h-4 w-4" />
            </span>
            <div>
              <h1 className="h-title">Inbox</h1>
              <p className="h-sub">
                Everything you owe across the procurement portfolio — risks, clarifications, scores, approvals.
              </p>
            </div>
          </div>
        </div>
        {unread > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-semibold text-white">
            {unread} unread
          </span>
        ) : null}
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QueueTile
          icon={ClipboardCheck}
          accent="violet"
          label="Scores to submit"
          value={pendingScores.length}
          hint="across your tenders"
        />
        <QueueTile
          icon={MessageCircle}
          accent="amber"
          label="Open clarifications"
          value={openClarifs.length}
          hint="awaiting vendor or your action"
        />
        <QueueTile
          icon={ShieldCheck}
          accent="emerald"
          label="Approvals pending"
          value={pendingApprovals.length}
          hint="next step in the chain"
        />
        <QueueTile
          icon={AlertTriangle}
          accent="rose"
          label="High-severity risks"
          value={
            notifications.filter((n) => n.kind === "RISK_FLAGGED").length
          }
          hint="last 7 days"
        />
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-ink-200/70 bg-white p-3 shadow-soft">
          <header className="flex items-center justify-between px-3 pb-2 pt-1">
            <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
              Notifications
            </h2>
            <span className="text-[11px] text-ink-500">{notifications.length} total</span>
          </header>
          <ul className="divide-y divide-ink-200/70">
            {notifications.map((n) => {
              const meta = KIND_META[n.kind] ?? KIND_META.MENTIONED;
              const Icon = meta.icon;
              return (
                <li key={n.id}>
                  <Link
                    href={n.href ?? "#"}
                    className="group flex items-start gap-3 px-3 py-3 transition hover:bg-canvas-50"
                  >
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13px] font-semibold text-ink-900">
                          {n.title}
                        </p>
                        {!n.isRead ? (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500" />
                        ) : null}
                      </div>
                      {n.body ? (
                        <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink-600">
                          {n.body}
                        </p>
                      ) : null}
                      <div className="mt-1 flex items-center gap-2 text-[10.5px] uppercase tracking-wide text-ink-400">
                        <span>{meta.label}</span>
                        <span>·</span>
                        <span>{fmtRelative(n.createdAt)}</span>
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
                  </Link>
                </li>
              );
            })}
            {notifications.length === 0 ? (
              <li className="px-3 py-10 text-center text-[12.5px] text-ink-500">
                Inbox zero. Excellent.
              </li>
            ) : null}
          </ul>
        </section>

        <aside className="space-y-4">
          <PanelList
            title="Your scoring queue"
            empty="All caught up — no scoring pending."
            items={pendingScores.map((p) => ({
              key: p.id,
              href: `/tenders/${p.tender.id}/score`,
              title: p.tender.name,
              meta: `${p.role ?? "Evaluator"} · ${p.tender.reference ?? ""}`,
            }))}
          />
          <PanelList
            title="Approvals awaiting you"
            empty="No approvals waiting."
            items={pendingApprovals.map((a) => ({
              key: a.id,
              href: `/tenders/${a.award.tender.id}/approval`,
              title: a.award.tender.name,
              meta: `${a.approverRole} · ${a.approverName}`,
            }))}
          />
          <PanelList
            title="Open clarifications"
            empty="No open clarifications."
            items={openClarifs.map((c) => ({
              key: c.id,
              href: `/tenders/${c.bid.tenderId}/clarifications`,
              title: c.schemaItemRef ?? "Clarification",
              meta: c.bid.vendorName,
            }))}
          />
        </aside>
      </div>
    </div>
  );
}

function QueueTile({
  icon: Icon,
  accent,
  label,
  value,
  hint,
}: {
  icon: any;
  accent: "violet" | "emerald" | "amber" | "sky" | "rose";
  label: string;
  value: number;
  hint: string;
}) {
  const c =
    accent === "violet"
      ? "bg-violet-50 text-violet-600"
      : accent === "emerald"
      ? "bg-emerald-50 text-emerald-600"
      : accent === "amber"
      ? "bg-amber-50 text-amber-600"
      : accent === "rose"
      ? "bg-rose-50 text-rose-600"
      : "bg-sky-50 text-sky-600";
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-ink-900">{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${c}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-[11px] text-ink-500">{hint}</p>
    </div>
  );
}

function PanelList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { key: string; href: string; title: string; meta: string }[];
}) {
  return (
    <section className="rounded-2xl border border-ink-200/70 bg-white p-3 shadow-soft">
      <header className="px-2 pb-1 pt-1">
        <h3 className="font-display text-[13.5px] font-semibold tracking-tight text-ink-900">
          {title}
        </h3>
      </header>
      <ul className="space-y-1">
        {items.length === 0 ? (
          <li className="px-2 py-3 text-[12px] text-ink-500">{empty}</li>
        ) : (
          items.map((i) => (
            <li key={i.key}>
              <Link
                href={i.href}
                className="flex items-center justify-between rounded-lg px-2 py-2 transition hover:bg-canvas-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-ink-900">
                    {i.title}
                  </p>
                  <p className="truncate text-[11px] text-ink-500">{i.meta}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
