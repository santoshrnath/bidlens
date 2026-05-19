"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Edit3,
  ArrowRight,
  ShieldAlert,
  EyeOff,
  Eye,
} from "lucide-react";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { RiskBadge } from "@/components/ui/risk-badge";
import { fmtMoney, cn, severityColor } from "@/lib/utils";

type Risk = {
  id: string;
  category: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  description: string;
  clauseRef: string | null;
  vendorPosition: string | null;
  schemaRequirement: string | null;
  pageRef: string | null;
};

type Bid = {
  id: string;
  vendorName: string;
  vendorShortName: string;
  accentColor: string | null;
  isRecommended: boolean;
  complianceLevel: string | null;
  overallScore: number | null;
  totalPrice: number | null;
  currency: string | null;
  validityDays: number | null;
  responses: Record<string, { excerpt: string; sourceRef?: string }>;
  risks: Risk[];
};

export function ComparisonMatrix({
  tenderId: _tenderId,
  tenderName,
  reference,
  weights,
  scope,
  bids,
  masked,
}: {
  tenderId: string;
  tenderName: string;
  reference: string | null;
  weights: { technical: number; commercial: number; delivery: number; localContent: number };
  scope: Array<{ id: string; code: string; title: string; requirement: string; weight: number; mandatory: boolean }>;
  bids: Bid[];
  masked?: boolean;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const toggleHref = useMemo(() => {
    const next = new URLSearchParams(sp?.toString() ?? "");
    if (masked) next.delete("masked");
    else next.set("masked", "1");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [masked, pathname, sp]);
  const allRisks: Array<Risk & { bidId: string; vendorName: string; accentColor: string | null }> =
    useMemo(
      () =>
        bids.flatMap((b) =>
          b.risks.map((r) => ({
            ...r,
            bidId: b.id,
            vendorName: b.vendorName,
            accentColor: b.accentColor,
          })),
        ),
      [bids],
    );

  // Distinct risk categories for the right-rail clause-comparison filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    allRisks[0]?.category ?? null,
  );
  const filtered = selectedCategory
    ? allRisks.filter((r) => r.category === selectedCategory)
    : allRisks;
  const [activeRiskId, setActiveRiskId] = useState<string | null>(filtered[0]?.id ?? null);
  const activeRisk = filtered.find((r) => r.id === activeRiskId) ?? filtered[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-5">
        {/* Header / weights strip */}
        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-900">
                Evaluation criteria
              </h2>
              <p className="text-[12px] text-ink-500">
                Weights are locked once the schema is approved. Changes are captured in the audit trail.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={toggleHref}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition ${
                  masked
                    ? "border-violet-300 bg-violet-600 text-white hover:bg-violet-700"
                    : "border-ink-200/70 bg-white text-ink-700 hover:bg-canvas-50"
                }`}
                scroll={false}
              >
                {masked ? (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Unmask vendors
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Blind mode
                  </>
                )}
              </Link>
              <button className="btn-ghost text-[12px]">
                <Edit3 className="h-3.5 w-3.5" />
                Edit weights
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <WeightChip label="Technical" value={weights.technical} color="violet" />
            <WeightChip label="Commercial" value={weights.commercial} color="emerald" />
            <WeightChip label="Delivery" value={weights.delivery} color="sky" />
            <WeightChip label="Local Content" value={weights.localContent} color="amber" />
          </div>
        </div>

        {/* Bid headers row */}
        <div className="overflow-x-auto rounded-2xl border border-ink-200/70 bg-white shadow-soft scrollbar-thin">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="bg-canvas-50/80">
                <th className="sticky left-0 z-10 w-[260px] border-r border-ink-200/70 bg-canvas-50/95 px-4 py-3 text-left align-bottom">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    Schema · {reference}
                  </p>
                  <p className="text-[13px] font-semibold text-ink-900">{tenderName}</p>
                </th>
                {bids.map((b) => (
                  <th
                    key={b.id}
                    className="min-w-[200px] border-l border-ink-200/70 px-4 py-3 align-bottom"
                  >
                    <div className="flex items-center gap-2">
                      <VendorAvatar
                        name={b.vendorName}
                        color={b.accentColor}
                        size={28}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-ink-900">
                          {b.vendorName}
                        </p>
                        {b.isRecommended ? (
                          <span className="pill-emerald mt-1">
                            <CheckCircle2 className="h-3 w-3" /> Recommended
                          </span>
                        ) : (
                          <span className="pill mt-1">{b.complianceLevel ?? "—"}</span>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/70">
              {scope.map((row) => (
                <ScopeRow key={row.id} row={row} bids={bids} />
              ))}
              <PricingRow bids={bids} />
              <ValidityRow bids={bids} />
              <LiabilityRow bids={bids} />
            </tbody>
          </table>
        </div>

        {/* Overall scores ribbon */}
        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <header>
            <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
              Overall scores
            </h3>
            <p className="text-[12px] text-ink-500">
              Weighted by the criteria above. Individual evaluator scores in the Scores tab.
            </p>
          </header>
          <ul className="mt-3 space-y-2">
            {[...bids]
              .sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0))
              .map((b, i) => {
                const score = b.overallScore ?? 0;
                const pct = (score / 10) * 100;
                return (
                  <li key={b.id} className="grid grid-cols-[160px_1fr_60px] items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <VendorAvatar name={b.vendorName} color={b.accentColor} size={22} />
                      <span className="truncate text-[13px] font-medium text-ink-800">
                        {b.vendorShortName}
                      </span>
                    </div>
                    <div className="relative h-2.5 overflow-hidden rounded-full bg-ink-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.08 * i, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${b.accentColor ?? "#7c5cff"}, ${
                            b.accentColor ?? "#7c5cff"
                          }aa)`,
                        }}
                      />
                    </div>
                    <span className="tabular-nums text-[14px] font-semibold text-ink-900">
                      {score.toFixed(1)}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      {/* Clause comparison right-rail */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <header className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-[14px] font-semibold tracking-tight text-ink-900">
              Clause comparison
            </h3>
            <span className="pill-violet">
              <Sparkles className="h-3 w-3" /> AI surfaced
            </span>
          </header>

          <div className="space-y-2">
            {[...new Set(allRisks.map((r) => r.category))].map((cat) => {
              const sevs = allRisks.filter((r) => r.category === cat);
              const worst = sevs.reduce<"HIGH" | "MEDIUM" | "LOW" | "INFO">((acc, r) => {
                const order: any = { HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0 };
                return order[r.severity] > order[acc] ? r.severity : acc;
              }, "LOW");
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition",
                    active
                      ? "border-violet-300 bg-violet-50/60"
                      : "border-ink-200/70 bg-white hover:bg-canvas-50",
                  )}
                >
                  <span className="text-[13px] font-semibold text-ink-800">{cat}</span>
                  <RiskBadge severity={worst} size="sm" />
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              Vendors on this clause
            </p>
            <ul className="mt-2 space-y-1.5">
              {filtered.map((r) => {
                const active = activeRiskId === r.id;
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => setActiveRiskId(r.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition",
                        active
                          ? "border-violet-300 bg-violet-50/60"
                          : "border-ink-200/70 bg-white hover:bg-canvas-50",
                      )}
                    >
                      <span className="flex items-center gap-2 text-[12px] font-medium text-ink-800">
                        <VendorAvatar
                          name={r.vendorName}
                          color={r.accentColor}
                          size={18}
                        />
                        {r.vendorName}
                      </span>
                      <RiskBadge severity={r.severity} size="sm" label={labelFor(r.severity)} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeRisk ? (
            <motion.div
              key={activeRisk.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-ink-900">{activeRisk.vendorName}</p>
                <RiskBadge severity={activeRisk.severity} size="sm" />
              </div>
              <p className="mt-1.5 text-[11px] uppercase tracking-wide text-ink-400">
                {activeRisk.category} · {activeRisk.clauseRef}
              </p>
              <p className="mt-3 text-[13px] font-semibold text-ink-900">{activeRisk.title}</p>
              {activeRisk.vendorPosition ? (
                <blockquote className="mt-2 rounded-xl border border-ink-200/70 bg-canvas-50 px-3.5 py-3 text-[12px] italic leading-snug text-ink-700">
                  “{activeRisk.vendorPosition}”
                </blockquote>
              ) : (
                <p className="mt-2 text-[12px] text-ink-600">{activeRisk.description}</p>
              )}
              {activeRisk.schemaRequirement ? (
                <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/50 px-3.5 py-2.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-700">
                    <ShieldAlert className="h-3 w-3" />
                    Schema requirement
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-ink-700">
                    {activeRisk.schemaRequirement}
                  </p>
                </div>
              ) : null}
              {activeRisk.pageRef ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-500">
                  <FileText className="h-3 w-3" />
                  Source: {activeRisk.pageRef}
                </p>
              ) : null}
              <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">
                <Sparkles className="h-4 w-4" /> Add to Risk Register
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function WeightChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "violet" | "emerald" | "amber" | "sky";
}) {
  const bg =
    color === "violet"
      ? "bg-violet-50 text-violet-700"
      : color === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : color === "amber"
      ? "bg-amber-50 text-amber-700"
      : "bg-sky-50 text-sky-700";
  return (
    <div className="rounded-xl border border-ink-200/70 bg-white px-3.5 py-3">
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-medium text-ink-700">{label}</span>
        <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-semibold", bg)}>
          {value}%
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-100">
        <div
          className={cn(
            "h-full rounded-full",
            color === "violet"
              ? "bg-violet-500"
              : color === "emerald"
              ? "bg-emerald-500"
              : color === "amber"
              ? "bg-amber-500"
              : "bg-sky-500",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ScopeRow({
  row,
  bids,
}: {
  row: { id: string; code: string; title: string; requirement: string; mandatory: boolean };
  bids: Bid[];
}) {
  return (
    <tr>
      <th className="sticky left-0 z-10 w-[260px] border-r border-ink-200/70 bg-white px-4 py-4 text-left align-top">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
          {row.code}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-ink-900">{row.title}</p>
        <p className="mt-1 max-w-[230px] text-[11px] leading-snug text-ink-500">
          {row.requirement}
        </p>
      </th>
      {bids.map((b) => {
        const r = b.responses[row.id];
        const flag = b.risks.find((rr) => rr.clauseRef?.endsWith(row.code));
        return (
          <td
            key={b.id}
            className={cn(
              "border-l border-ink-200/70 align-top text-[12px]",
              flag?.severity === "HIGH"
                ? "bg-rose-50/50"
                : flag?.severity === "MEDIUM"
                ? "bg-amber-50/40"
                : "",
            )}
          >
            <div className="px-4 py-4">
              {r ? (
                <>
                  <p className="text-[12.5px] leading-relaxed text-ink-800">
                    {r.excerpt}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-ink-500">
                    <FileText className="h-3 w-3" />
                    {r.sourceRef ?? "Source attached"}
                  </p>
                </>
              ) : (
                <span className="text-[11px] italic text-ink-400">No response</span>
              )}
              {flag ? (
                <div className="mt-2">
                  <RiskBadge severity={flag.severity} size="sm" label={flag.title} />
                </div>
              ) : null}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

function PricingRow({ bids }: { bids: Bid[] }) {
  return (
    <tr className="bg-canvas-50/60">
      <th className="sticky left-0 z-10 w-[260px] border-r border-ink-200/70 bg-canvas-50/90 px-4 py-4 text-left align-top">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
          2.0 Pricing
        </p>
        <p className="mt-1 text-[13px] font-semibold text-ink-900">Total Price (USD)</p>
        <p className="mt-1 max-w-[230px] text-[11px] leading-snug text-ink-500">
          Normalised across the schema's pricing structure. Drill in for breakdown.
        </p>
      </th>
      {bids.map((b) => (
        <td key={b.id} className="border-l border-ink-200/70 px-4 py-4 align-top">
          <p className="font-display text-[20px] font-semibold tabular-nums tracking-tight text-ink-900">
            {fmtMoney(b.totalPrice ?? 0, b.currency ?? "USD", false)}
          </p>
          <button className="mt-1 text-[11px] font-semibold text-violet-600 hover:text-violet-700">
            View breakdown →
          </button>
        </td>
      ))}
    </tr>
  );
}

function ValidityRow({ bids }: { bids: Bid[] }) {
  return (
    <tr>
      <th className="sticky left-0 z-10 w-[260px] border-r border-ink-200/70 bg-white px-4 py-3 text-left">
        <p className="text-[12px] font-semibold text-ink-800">Validity</p>
      </th>
      {bids.map((b) => {
        const ok = (b.validityDays ?? 0) >= 120;
        return (
          <td key={b.id} className="border-l border-ink-200/70 px-4 py-3">
            <span className={cn(ok ? "pill-emerald" : "pill-amber")}>
              {b.validityDays ?? "—"} days
            </span>
          </td>
        );
      })}
    </tr>
  );
}

function LiabilityRow({ bids }: { bids: Bid[] }) {
  return (
    <tr className="bg-canvas-50/60">
      <th className="sticky left-0 z-10 w-[260px] border-r border-ink-200/70 bg-canvas-50/90 px-4 py-4 text-left align-top">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
          3.1
        </p>
        <p className="mt-1 text-[13px] font-semibold text-ink-900">Liability cap</p>
        <p className="mt-1 max-w-[230px] text-[11px] leading-snug text-ink-500">
          What is the limitation of liability? RFP minimum: 100% of contract value.
        </p>
      </th>
      {bids.map((b) => {
        const r = b.responses["3.1"];
        const flag = b.risks.find((rr) => rr.category.toLowerCase().includes("liability"));
        const c = flag ? severityColor(flag.severity) : null;
        return (
          <td
            key={b.id}
            className={cn(
              "border-l border-ink-200/70 px-4 py-4 align-top",
              flag?.severity === "HIGH" ? "bg-rose-50/60" : "",
            )}
          >
            <p className="text-[12.5px] leading-snug text-ink-800">
              {r?.excerpt ?? "—"}
            </p>
            {flag ? (
              <span
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  c?.bg,
                  c?.border,
                  c?.text,
                )}
              >
                {labelFor(flag.severity)}
              </span>
            ) : (
              <span className="mt-2 inline-block pill-emerald">Compliant</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function labelFor(s: string): string {
  return s === "HIGH"
    ? "High Risk"
    : s === "MEDIUM"
    ? "Medium"
    : s === "LOW"
    ? "Low Risk"
    : "Info";
}
