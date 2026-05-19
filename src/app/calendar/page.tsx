import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { StageBadge } from "@/components/ui/stage-badge";
import { fmtDate, fmtMoney } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const tenders = await prisma.tender.findMany({
    orderBy: { closingAt: "asc" },
    include: {
      _count: { select: { bids: true, risks: true } },
    },
  });

  // Group by month (closingAt)
  const byMonth = new Map<string, typeof tenders>();
  for (const t of tenders) {
    if (!t.closingAt) continue;
    const k = t.closingAt.toLocaleString("en-GB", { month: "long", year: "numeric" });
    const arr = byMonth.get(k) ?? [];
    arr.push(t);
    byMonth.set(k, arr);
  }

  // Build a simple month-grid for the next two months
  const months = nextMonths(new Date(), 2);

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6">
      <header className="flex items-end gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
          <CalendarDays className="h-4 w-4" />
        </span>
        <div>
          <h1 className="h-title">Calendar</h1>
          <p className="h-sub">
            Closing dates, BAFO windows and award targets across the portfolio.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {months.map((m) => (
          <MonthGrid
            key={m.key}
            label={m.label}
            year={m.year}
            month={m.monthIndex}
            tenders={byMonth.get(m.key) ?? []}
          />
        ))}
      </section>

      <section className="space-y-3">
        {Array.from(byMonth.entries()).map(([month, list]) => (
          <div
            key={month}
            className="rounded-2xl border border-ink-200/70 bg-white shadow-soft"
          >
            <header className="flex items-center justify-between border-b border-ink-200/70 px-5 py-3.5">
              <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
                {month}
              </h2>
              <span className="text-[12px] text-ink-500">
                {list.length} closing
              </span>
            </header>
            <ul className="divide-y divide-ink-200/70">
              {list.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tenders/${t.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-canvas-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 min-w-12 place-items-center rounded-lg bg-canvas-50 text-[11px] font-semibold text-ink-700">
                        {t.closingAt
                          ? t.closingAt.toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "—"}
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-ink-900">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-ink-500">
                          {t.reference ?? "—"} ·{" "}
                          {fmtMoney(t.budget, t.currency, true)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StageBadge stage={t.stage} />
                      {t._count.risks ? (
                        <span className="pill-amber">{t._count.risks} risks</span>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

function MonthGrid({
  label,
  year,
  month,
  tenders,
}: {
  label: string;
  year: number;
  month: number;
  tenders: { id: string; name: string; closingAt: Date | null; stage: string }[];
}) {
  const first = new Date(year, month, 1);
  const dayOfWeek = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null; tenders: typeof tenders }> = [];
  // Lead empty cells (week starts Mon for procurement folks)
  const lead = (dayOfWeek + 6) % 7;
  for (let i = 0; i < lead; i++) cells.push({ day: null, tenders: [] });
  for (let d = 1; d <= daysInMonth; d++) {
    const onDay = tenders.filter(
      (t) => t.closingAt && t.closingAt.getDate() === d,
    );
    cells.push({ day: d, tenders: onDay });
  }

  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[14px] font-semibold tracking-tight text-ink-900">
          {label}
        </h3>
        <span className="text-[11px] text-ink-500">{tenders.length} events</span>
      </header>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-ink-400">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((c, i) => (
          <div
            key={i}
            className={`relative aspect-square rounded-lg p-1 text-[10px] ${
              c.day == null
                ? ""
                : c.tenders.length
                ? "bg-violet-50 ring-1 ring-violet-200"
                : "bg-canvas-50"
            }`}
          >
            {c.day ? (
              <>
                <span className="text-ink-500">{c.day}</span>
                {c.tenders.length ? (
                  <div className="mt-0.5 space-y-0.5">
                    {c.tenders.slice(0, 1).map((t) => (
                      <Link
                        key={t.id}
                        href={`/tenders/${t.id}`}
                        className="block truncate rounded bg-violet-600 px-1 py-0.5 text-[9px] font-semibold text-white"
                      >
                        {t.name.split(" ").slice(0, 2).join(" ")}
                      </Link>
                    ))}
                    {c.tenders.length > 1 ? (
                      <span className="text-[9px] font-semibold text-violet-600">
                        +{c.tenders.length - 1} more
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function nextMonths(
  start: Date,
  count: number,
): { key: string; label: string; year: number; monthIndex: number }[] {
  const out: { key: string; label: string; year: number; monthIndex: number }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const label = d.toLocaleString("en-GB", { month: "long", year: "numeric" });
    out.push({
      key: label,
      label,
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
    });
  }
  return out;
}
