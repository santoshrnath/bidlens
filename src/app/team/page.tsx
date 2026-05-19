import { prisma } from "@/lib/prisma";
import { Users, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const evaluators = await prisma.evaluator.findMany({
    orderBy: { fullName: "asc" },
    include: { tender: { select: { name: true } } },
  });

  // Unique users
  const byEmail = new Map<string, { fullName: string; email: string; roles: Set<string>; tenders: number }>();
  for (const e of evaluators) {
    const k = e.email;
    const cur = byEmail.get(k) ?? { fullName: e.fullName, email: e.email, roles: new Set(), tenders: 0 };
    cur.roles.add(e.role ?? "Evaluator");
    cur.tenders += 1;
    byEmail.set(k, cur);
  }
  const people = Array.from(byEmail.values());

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-6">
      <header>
        <h1 className="h-title">Team</h1>
        <p className="h-sub mt-1">
          Procurement leads, evaluators and approvers. Every action they take is captured in the audit trail.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <div
            key={p.email}
            className="flex items-center gap-3 rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-[12px] font-semibold text-white">
              {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink-900">
                {p.fullName}
              </p>
              <p className="truncate text-[11px] text-ink-500">{p.email}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {Array.from(p.roles).map((r) => (
                  <span key={r} className="pill-violet">{r}</span>
                ))}
              </div>
            </div>
            <div className="text-right text-[11px] text-ink-500">
              <p className="font-semibold text-ink-900">{p.tenders}</p>
              <p>tender{p.tenders === 1 ? "" : "s"}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
        <div className="flex items-center gap-2 text-violet-700">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[12px] font-semibold uppercase tracking-wide">
            Role-based access
          </span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-700">
          Procurement leads see everything in their tenders. Evaluators see only the
          bids they are authorised to score, with optional vendor masking for blind
          evaluation. Approvers see the recommendation pack. Observers see the audit
          trail but no scoring detail.
        </p>
      </section>
    </div>
  );
}
