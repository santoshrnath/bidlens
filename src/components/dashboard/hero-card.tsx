"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function HeroCard({
  totalTenders,
  totalBids,
  awarded,
}: {
  totalTenders: number;
  totalBids: number;
  awarded: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-white via-violet-50/70 to-white p-7 shadow-soft"
    >
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-700">
          <Sparkles className="h-3 w-3" /> BidLens · Procurement intelligence
        </div>
        <h1 className="mt-4 font-display text-[34px] font-semibold leading-tight tracking-tight text-ink-900">
          Replace the comparison matrix.
          <br />
          <span className="text-violet-600">Decide on evidence.</span>
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-600">
          Drop the RFP. Drop the bids. BidLens extracts a structured comparison
          schema, normalises pricing, surfaces risky T&amp;Cs and produces a
          defensible audit trail — so the committee decides on merit, not on
          who's loudest.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Link href="/tenders/new" className="btn-primary">
            New tender
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/tenders" className="btn-ghost">
            Browse active tenders
          </Link>
        </div>
        <dl className="mt-7 grid grid-cols-3 gap-6 text-left">
          <Stat label="Active tenders" value={String(totalTenders)} />
          <Stat label="Bids analysed" value={String(totalBids)} />
          <Stat label="Awarded YTD" value={String(awarded)} />
        </dl>
      </div>

      {/* Decorative orbital */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[340px] w-[340px]">
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full border border-violet-200/70"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-8 rounded-full border border-violet-200/60"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-20 rounded-full border border-violet-300/60"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        />
        <div className="absolute inset-[42%] rounded-full bg-gradient-to-br from-violet-500 to-violet-700 shadow-[0_20px_50px_-15px_rgba(124,92,255,0.6)]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-ink-900">
        {value}
      </dd>
    </div>
  );
}
