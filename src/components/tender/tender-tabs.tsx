"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const TABS = [
  { key: "", label: "Overview" },
  { key: "comparison", label: "Comparison" },
  { key: "scores", label: "Scores" },
  { key: "risks", label: "Risks" },
  { key: "clarifications", label: "Clarifications" },
  { key: "audit", label: "Audit Trail" },
];

export function TenderTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const base = `/tenders/${id}`;
  return (
    <div className="relative border-b border-ink-200/70">
      <nav className="flex flex-wrap items-end gap-6">
        {TABS.map((t) => {
          const href = t.key ? `${base}/${t.key}` : base;
          const active =
            pathname === href ||
            (t.key === "" && pathname === base);
          return (
            <Link key={t.key} href={href} className="relative">
              <span className={active ? "tab-active" : "tab-idle"}>
                {t.label}
              </span>
              {active ? (
                <motion.div
                  layoutId="tender-tab-underline"
                  className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-violet-600"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
