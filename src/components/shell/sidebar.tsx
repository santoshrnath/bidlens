"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileSpreadsheet,
  ClipboardList,
  Building2,
  BarChart3,
  Library,
  Layers,
  Users,
  Settings,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: any; badge?: string }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tenders", label: "Tenders", icon: FileSpreadsheet, badge: "8" },
  { href: "/evaluations", label: "Evaluations", icon: ClipboardList },
  { href: "/vendors", label: "Vendors", icon: Building2 },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/clauses", label: "Clauses Library", icon: Library },
  { href: "/templates", label: "Templates", icon: Layers },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-ink-200/70 bg-white/80 backdrop-blur lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <Logo />
        <span className="text-[17px] font-semibold tracking-tight text-ink-900">
          BidLens
        </span>
      </div>

      {/* Workspace switcher */}
      <div className="px-3">
        <button className="flex w-full items-center justify-between rounded-xl border border-ink-200/70 bg-white px-3 py-2.5 text-left shadow-soft transition hover:border-ink-300">
          <span className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 text-[11px] font-semibold text-white">
              AC
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-ink-900">
                Acme Corporation
              </span>
              <span className="text-[11px] text-ink-500">Procurement</span>
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 text-ink-400" />
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <motion.div
                layoutId={active ? "nav-active" : undefined}
                whileHover={{ x: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={cn(active ? "nav-item-active" : "nav-item", "relative")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                      active
                        ? "bg-violet-600 text-white"
                        : "bg-ink-100 text-ink-600",
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-3.5">
        <div className="flex items-center gap-2 text-violet-700">
          <Sparkles className="h-4 w-4" />
          <span className="text-[12px] font-semibold">Claude is online</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-ink-600">
          Schema extraction, risk surfacing and clarification drafting are
          powered by Claude Sonnet 4.6. Humans decide.
        </p>
      </div>

      <div className="mx-3 mb-4 flex items-center gap-2.5 rounded-xl border border-ink-200/70 bg-white p-2.5">
        <img
          alt="Arjun Sharma"
          src="https://i.pravatar.cc/64?img=15"
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="flex flex-1 flex-col leading-tight">
          <span className="text-[13px] font-semibold text-ink-900">
            Arjun Sharma
          </span>
          <span className="text-[11px] text-ink-500">Procurement Manager</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-ink-400" />
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-[0_8px_20px_-8px_rgba(124,92,255,0.6)]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.4) 30deg, transparent 60deg)",
          mixBlendMode: "screen",
        }}
      />
    </span>
  );
}
