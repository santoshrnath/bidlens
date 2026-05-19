"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
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
  Inbox,
  Calendar,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav({
  inboxUnread,
  tenderCount,
}: {
  inboxUnread: number;
  tenderCount: number;
}) {
  const pathname = usePathname();
  const NAV: { href: string; label: string; icon: any; badge?: string }[] = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inbox", label: "Inbox", icon: Inbox, badge: inboxUnread ? String(inboxUnread) : undefined },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/tenders", label: "Tenders", icon: FileSpreadsheet, badge: tenderCount ? String(tenderCount) : undefined },
    { href: "/evaluations", label: "Evaluations", icon: ClipboardList },
    { href: "/vendors", label: "Vendors", icon: Building2 },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/clauses", label: "Clauses Library", icon: Library },
    { href: "/templates", label: "Templates", icon: Layers },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
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

      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <motion.div
                whileHover={{ x: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={cn(
                  active ? "nav-item-active" : "nav-item",
                  "relative",
                )}
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
          Schema extraction, risk surfacing and clarification drafting are powered by
          Claude Sonnet 4.6. Humans decide.
        </p>
      </div>

      <UserCell />
    </>
  );
}

function UserCell() {
  const { user, isLoaded } = useUser();
  return (
    <div className="mx-3 mb-4 rounded-xl border border-ink-200/70 bg-white p-2.5">
      <SignedIn>
        <div className="flex items-center gap-2.5">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 ring-1 ring-violet-200",
              },
            }}
          />
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-[13px] font-semibold text-ink-900">
              {isLoaded
                ? [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                  user?.username ||
                  user?.primaryEmailAddress?.emailAddress ||
                  "You"
                : "…"}
            </span>
            <span className="truncate text-[11px] text-ink-500">
              {user?.primaryEmailAddress?.emailAddress ?? "Procurement"}
            </span>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="space-y-1.5">
          <SignInButton mode="modal">
            <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-[12px] font-semibold text-white shadow-[0_6px_16px_-8px_rgba(124,92,255,0.55)] transition hover:bg-violet-700">
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="inline-flex w-full items-center justify-center rounded-lg border border-ink-200/70 bg-white px-3 py-2 text-[12px] font-medium text-ink-700 transition hover:bg-canvas-50">
              Create account
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
}
