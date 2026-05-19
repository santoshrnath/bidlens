"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, X, Copy, CheckCircle2 } from "lucide-react";

export function ClarificationDraftButton({ tenderName }: { tenderName: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<{ subject: string; questions: string[]; source?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setBusy(true);
    setDraft(null);
    setOpen(true);
    try {
      const res = await fetch("/api/ai/draft-clarification", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tenderName }),
      });
      const data = await res.json();
      setDraft(data);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  function copyAll() {
    if (!draft) return;
    const text =
      `Subject: ${draft.subject}\n\n` +
      draft.questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        onClick={generate}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2 text-[12px] font-semibold text-violet-700 transition hover:bg-violet-100"
      >
        {busy ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Drafting…
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" /> Draft with Claude
          </>
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink-950/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]"
            >
              <header className="flex items-start justify-between gap-3 border-b border-ink-200/70 bg-canvas-50/60 px-5 py-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700">
                    <Sparkles className="h-3 w-3" /> Drafted with Claude
                  </div>
                  <h3 className="mt-1.5 font-display text-[16px] font-semibold text-ink-900">
                    Round 2 clarification — draft
                  </h3>
                  <p className="text-[11px] text-ink-500">
                    Review and edit before sending. Claude proposes; procurement decides.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>
              <div className="px-5 py-5">
                {busy ? (
                  <div className="space-y-2">
                    <Skeleton w="60%" />
                    <Skeleton w="95%" />
                    <Skeleton w="88%" />
                    <Skeleton w="92%" />
                    <Skeleton w="78%" />
                  </div>
                ) : draft ? (
                  <>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-400">
                      Subject
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-ink-900">
                      {draft.subject}
                    </p>
                    <ol className="mt-4 space-y-3">
                      {draft.questions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-50 text-[11px] font-semibold text-violet-700">
                            {i + 1}
                          </span>
                          <p className="text-[13px] leading-relaxed text-ink-800">{q}</p>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : null}
              </div>
              <footer className="flex items-center justify-between gap-2 border-t border-ink-200/70 bg-canvas-50/60 px-5 py-3">
                <p className="text-[11px] text-ink-500">
                  {draft?.source === "claude"
                    ? "Generated by Claude Sonnet 4.6"
                    : "Demo draft (offline)"}
                </p>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost text-[12px]" onClick={copyAll}>
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                  <button className="btn-primary text-[12px]">Use draft</button>
                </div>
              </footer>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Skeleton({ w }: { w: string }) {
  return (
    <div
      className="h-3 rounded bg-gradient-to-r from-ink-100 via-violet-100/60 to-ink-100 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]"
      style={{ width: w }}
    />
  );
}
