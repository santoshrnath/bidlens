"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Sparkles,
  Send,
  PenLine,
} from "lucide-react";
import { VendorAvatar } from "@/components/ui/vendor-avatar";
import { fmtRelative, cn } from "@/lib/utils";

type Step = {
  id: string;
  order: number;
  approverName: string;
  approverRole: string;
  approverEmail: string | null;
  threshold: number | null;
  decision: "PENDING" | "APPROVED" | "REJECTED" | "ABSTAINED";
  decidedAt: Date | null;
  comment: string | null;
};

export function ApprovalChain({
  tenderId: _tenderId,
  tenderName,
  reference,
  recommendation,
  steps: initialSteps,
}: {
  tenderId: string;
  tenderName: string;
  reference: string | null;
  recommendation: {
    vendorName: string;
    vendorAccent: string | null;
    contractValue: number;
    currency: string;
    contractValueFmt: string;
    rationale: string;
    requestedBy: string;
  };
  steps: Step[];
}) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [comment, setComment] = useState("");

  const decided = steps.filter((s) => s.decision === "APPROVED").length;
  const total = steps.length;
  const pct = total ? (decided / total) * 100 : 0;
  const allDecided = steps.every((s) => s.decision !== "PENDING");
  const nextStep = steps.find((s) => s.decision === "PENDING");

  function decide(decision: "APPROVED" | "REJECTED") {
    if (!nextStep) return;
    setSteps((prev) =>
      prev.map((s) =>
        s.id === nextStep.id
          ? {
              ...s,
              decision,
              decidedAt: new Date(),
              comment: comment || s.comment,
            }
          : s,
      ),
    );
    setComment("");
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        {/* Recommendation card */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/40 to-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="pill-emerald">
                <Sparkles className="h-3 w-3" /> Award recommendation
              </span>
              <h2 className="mt-2 font-display text-[18px] font-semibold tracking-tight text-ink-900">
                {recommendation.vendorName}
              </h2>
              <p className="text-[12px] text-ink-500">
                {tenderName} · {reference ?? ""} · requested by {recommendation.requestedBy}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                Contract value
              </p>
              <p className="font-display text-[22px] font-semibold tabular-nums text-ink-900">
                {recommendation.contractValueFmt}
              </p>
            </div>
          </div>
          {recommendation.rationale ? (
            <p className="mt-3 max-w-3xl rounded-xl border border-ink-200/70 bg-canvas-50 px-3.5 py-3 text-[12.5px] leading-relaxed text-ink-700">
              {recommendation.rationale}
            </p>
          ) : null}
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
                Approval chain
              </h3>
              <p className="text-[12px] text-ink-500">
                Sequential sign-off. Each level is value-threshold-aware. Decisions are
                captured in the audit trail.
              </p>
            </div>
            <span className="text-[12px] font-semibold tabular-nums text-ink-900">
              {decided}/{total} approved
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Chain */}
        <ol className="relative space-y-3 pl-4">
          <span className="absolute left-[15px] top-2 bottom-2 w-px bg-ink-200" />
          {steps.map((s, i) => (
            <ChainItem
              key={s.id}
              step={s}
              isLast={i === steps.length - 1}
              isNext={nextStep?.id === s.id}
            />
          ))}
        </ol>
      </div>

      {/* Decide rail */}
      <aside className="space-y-4">
        <AnimatePresence mode="wait">
          {nextStep ? (
            <motion.div
              key={nextStep.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-violet-200 bg-white p-5 shadow-soft"
            >
              <span className="pill-violet">
                <PenLine className="h-3 w-3" /> Decide now
              </span>
              <h3 className="mt-2 font-display text-[14.5px] font-semibold tracking-tight text-ink-900">
                {nextStep.approverName}
              </h3>
              <p className="text-[12px] text-ink-500">{nextStep.approverRole}</p>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment that goes into the audit trail."
                className="input-text mt-3 resize-y"
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-[12.5px] font-semibold text-rose-600 transition hover:bg-rose-50"
                  onClick={() => decide("REJECTED")}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-[12.5px] font-semibold text-white transition hover:bg-emerald-700"
                  onClick={() => decide("APPROVED")}
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
              </div>
              <p className="mt-3 text-[11px] leading-snug text-ink-500">
                Mobile-first: senior approvers can decide from a phone with a push
                notification. This is the screen they land on.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-soft"
            >
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="mt-2 font-display text-[15px] font-semibold tracking-tight text-ink-900">
                {allDecided
                  ? "Award approved — ready for execution"
                  : "Approval complete"}
              </h3>
              <p className="mt-1 text-[12px] text-ink-600">
                Award letter to {recommendation.vendorName} and regret letters to losing
                bidders can be issued from here.
              </p>
              <button className="btn-primary mt-3 text-[12px]">
                <Send className="h-3.5 w-3.5" /> Issue letters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <h3 className="font-display text-[13.5px] font-semibold tracking-tight text-ink-900">
            Vendor on offer
          </h3>
          <div className="mt-3 flex items-center gap-2.5">
            <VendorAvatar
              name={recommendation.vendorName}
              color={recommendation.vendorAccent}
              size={28}
            />
            <div>
              <p className="text-[13px] font-semibold text-ink-900">
                {recommendation.vendorName}
              </p>
              <p className="text-[11px] text-ink-500">
                {recommendation.contractValueFmt}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ChainItem({
  step,
  isLast: _isLast,
  isNext,
}: {
  step: Step;
  isLast: boolean;
  isNext: boolean;
}) {
  const c =
    step.decision === "APPROVED"
      ? { dot: "bg-emerald-500", icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-700", label: "Approved" }
      : step.decision === "REJECTED"
      ? { dot: "bg-rose-500", icon: XCircle, bg: "bg-rose-50", text: "text-rose-700", label: "Rejected" }
      : isNext
      ? { dot: "bg-violet-500", icon: Clock, bg: "bg-violet-50", text: "text-violet-700", label: "Awaiting decision" }
      : { dot: "bg-ink-300", icon: Clock, bg: "bg-ink-50", text: "text-ink-500", label: "Queued" };
  const Icon = c.icon;
  return (
    <li className="relative">
      <span className={cn("absolute -left-4 top-3 grid h-3 w-3 place-items-center rounded-full", c.dot)} />
      <div
        className={cn(
          "rounded-2xl border bg-white p-4 shadow-soft transition",
          isNext ? "border-violet-300 ring-4 ring-violet-100" : "border-ink-200/70",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink-900">
              {step.approverName}
            </p>
            <p className="text-[11px] text-ink-500">
              {step.approverRole}
              {step.threshold && step.threshold > 0
                ? ` · threshold $${(step.threshold / 1000).toFixed(0)}k+`
                : ""}
            </p>
          </div>
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold", c.bg, c.text)}>
            <Icon className="h-3 w-3" />
            {c.label}
          </span>
        </div>
        {step.comment ? (
          <p className="mt-2 rounded-xl border border-ink-200/70 bg-canvas-50 px-3 py-2 text-[12.5px] italic leading-snug text-ink-700">
            "{step.comment}"
          </p>
        ) : null}
        {step.decidedAt ? (
          <p className="mt-2 text-[11px] text-ink-400">
            {fmtRelative(step.decidedAt)}
          </p>
        ) : null}
      </div>
    </li>
  );
}
