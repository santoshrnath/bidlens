"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export function NotificationBell({ unread }: { unread: number }) {
  return (
    <Link
      href="/inbox"
      className="relative grid h-9 w-9 place-items-center rounded-xl border border-ink-200/70 bg-white text-ink-500 transition hover:text-ink-800"
      aria-label="Inbox"
    >
      <Bell className="h-4 w-4" />
      {unread > 0 ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 480, damping: 24 }}
          className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-violet-600 px-1 text-[10px] font-semibold leading-none text-white shadow-[0_4px_12px_-4px_rgba(124,92,255,0.6)]"
        >
          {unread > 9 ? "9+" : unread}
        </motion.span>
      ) : null}
    </Link>
  );
}
