"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { cn } from "@/lib/utils";

type Criterion = { key: string; label: string; weight: number };
type Bid = {
  id: string;
  vendorName: string;
  vendorShortName: string;
  accentColor: string | null;
  overallScore: number | null;
  complianceLevel: string | null;
  strengths: string[];
  weaknesses: string[];
};

export function EvaluatorWorkspace({
  tenderId: _tenderId,
  tenderName,
  evaluator,
  criteria,
  bids,
}: {
  tenderId: string;
  tenderName: string;
  evaluator: { id: string; fullName: string; role: string; hasSubmitted: boolean } | null;
  criteria: Criterion[];
  bids: Bid[];
}) {
  const [scores, setScores] = useState<Record<string, Record<string, number | null>>>(
    () => {
      const out: Record<string, Record<string, number | null>> = {};
      for (const b of bids) {
        out[b.id] = {};
        for (const c of criteria) out[b.id][c.key] = null;
      }
      return out;
    },
  );
  const [comments, setComments] = useState<Record<string, string>>({});
  const [activeBid, setActiveBid] = useState(0);
  const [locked, setLocked] = useState(false);

  const completion = useMemo(() => {
    const total = bids.length * criteria.length;
    let done = 0;
    for (const b of bids) {
      for (const c of criteria) {
        if (scores[b.id][c.key] != null) done++;
      }
    }
    return { done, total, pct: total ? (done / total) * 100 : 0 };
  }, [scores, bids, criteria]);

  const bid = bids[activeBid];
  const weighted = useMemo(() => {
    if (!bid) return null;
    let sum = 0;
    let w = 0;
    for (const c of criteria) {
      const v = scores[bid.id][c.key];
      if (v != null) {
        sum += v * c.weight;
        w += c.weight;
      }
    }
    return w ? sum / w : null;
  }, [scores, bid, criteria]);

  if (!evaluator) {
    return (
      <div className="rounded-2xl border border-ink-200/70 bg-white p-8 text-center text-[13px] text-ink-500 shadow-soft">
        You're not on this tender's committee yet. Procurement can invite you from the
        Overview tab.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {/* Header card */}
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white via-violet-50/50 to-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                <ShieldCheck className="h-3 w-3" /> Private scoring workspace
              </div>
              <h2 className="mt-2 font-display text-[16px] font-semibold tracking-tight text-ink-900">
                {evaluator.fullName} · {evaluator.role}
              </h2>
              <p className="text-[12px] text-ink-500">
                Your scores stay private until you Lock &amp; submit. The chair only sees
                consolidated results.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                Completion
              </p>
              <p className="text-2xl font-semibold tabular-nums text-ink-900">
                {completion.done}/{completion.total}
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
              initial={{ width: 0 }}
              animate={{ width: `${completion.pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Bid stepper */}
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-ink-200/70 bg-white p-2 shadow-soft">
          <button
            onClick={() => setActiveBid((i) => Math.max(0, i - 1))}
            disabled={activeBid === 0}
            className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-canvas-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-1 items-center gap-2 overflow-x-auto px-2 scrollbar-thin">
            {bids.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setActiveBid(i)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 transition",
                  activeBid === i
                    ? "border-violet-300 bg-violet-50/60"
                    : "border-ink-200/70 bg-white hover:bg-canvas-50",
                )}
              >
                <VendorAvatar name={b.vendorName} color={b.accentColor} size={18} />
                <span className="text-[12px] font-medium text-ink-800">
                  {b.vendorShortName}
                </span>
                {Object.values(scores[b.id]).every((v) => v != null) ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : null}
              </button>
            ))}
          </div>
          <button
            onClick={() => setActiveBid((i) => Math.min(bids.length - 1, i + 1))}
            disabled={activeBid === bids.length - 1}
            className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-canvas-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Bid scoring card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bid.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-soft"
          >
            <header className="flex items-center justify-between gap-3 border-b border-ink-200/70 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <VendorAvatar name={bid.vendorName} color={bid.accentColor} size={32} />
                <div>
                  <p className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
                    {bid.vendorName}
                  </p>
                  <p className="text-[11px] text-ink-500">
                    {bid.complianceLevel ?? "Compliance pending"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                  Your weighted score
                </p>
                <p className="text-2xl font-semibold tabular-nums text-ink-900">
                  {weighted != null ? weighted.toFixed(2) : "—"}
                </p>
              </div>
            </header>
            <div className="space-y-4 px-5 py-4">
              {criteria.map((c) => (
                <CriterionRow
                  key={c.key}
                  criterion={c}
                  value={scores[bid.id][c.key]}
                  disabled={locked}
                  onChange={(v) =>
                    setScores((s) => ({
                      ...s,
                      [bid.id]: { ...s[bid.id], [c.key]: v },
                    }))
                  }
                />
              ))}
              <div>
                <label className="label">Comments &amp; evidence references</label>
                <textarea
                  rows={3}
                  disabled={locked}
                  value={comments[bid.id] ?? ""}
                  onChange={(e) =>
                    setComments((s) => ({ ...s, [bid.id]: e.target.value }))
                  }
                  placeholder="Reference the bid section / page that shaped your view. The committee chair sees these."
                  className="input-text mt-1.5 resize-y"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft">
          <p className="text-[11px] text-ink-500">
            Tender · <span className="font-semibold text-ink-700">{tenderName}</span>
          </p>
          <div className="flex items-center gap-2">
            <button disabled={locked} className="btn-ghost">
              Save draft
            </button>
            <button
              onClick={() => setLocked(true)}
              disabled={locked || completion.done < completion.total}
              className="btn-primary"
            >
              {locked ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Locked &amp; submitted
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Lock &amp; submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side: strengths/weaknesses + COI declaration */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <header className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-[13.5px] font-semibold tracking-tight text-ink-900">
              Strengths &amp; weaknesses
            </h3>
            <span className="pill-violet">
              <Sparkles className="h-3 w-3" /> AI surfaced
            </span>
          </header>
          <p className="text-[11px] text-ink-500">
            Generated from the bid; not part of your score.
          </p>
          <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-emerald-700">
            Strengths
          </p>
          <ul className="mt-1 space-y-1 text-[12px] text-ink-700">
            {bid.strengths.map((s, i) => (
              <li key={i} className="flex gap-1.5">
                <Star className="mt-0.5 h-3 w-3 text-emerald-500" /> {s}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-rose-700">
            Weaknesses
          </p>
          <ul className="mt-1 space-y-1 text-[12px] text-ink-700">
            {bid.weaknesses.map((s, i) => (
              <li key={i} className="flex gap-1.5">
                <Star className="mt-0.5 h-3 w-3 rotate-180 text-rose-500" /> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <div className="flex items-center gap-2 text-amber-700">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[12px] font-semibold uppercase tracking-wide">
              Conflict of interest
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-ink-700">
            Have you declared any conflict of interest with any bidder for this tender?
          </p>
          <label className="mt-3 flex items-start gap-2 text-[12px] text-ink-700">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-ink-300 text-violet-600 focus:ring-violet-200"
              defaultChecked
            />
            <span>I declare no conflict of interest with any bidder for this tender.</span>
          </label>
        </div>
      </aside>
    </div>
  );
}

function CriterionRow({
  criterion,
  value,
  onChange,
  disabled,
}: {
  criterion: Criterion;
  value: number | null;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-ink-900">{criterion.label}</p>
          <p className="text-[11px] text-ink-500">Weight {criterion.weight}%</p>
        </div>
        <p className="tabular-nums text-[14px] font-semibold text-ink-900">
          {value != null ? value.toFixed(1) : "—"}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-11 gap-1">
        {Array.from({ length: 11 }).map((_, i) => {
          const v = i; // 0..10
          const active = value === v;
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(v)}
              className={cn(
                "h-9 rounded-lg border text-[11px] font-semibold transition",
                active
                  ? "border-violet-500 bg-violet-600 text-white shadow-[0_4px_14px_-6px_rgba(124,92,255,0.55)]"
                  : "border-ink-200 bg-white text-ink-600 hover:border-violet-200 hover:bg-violet-50",
              )}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
