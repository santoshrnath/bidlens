import { Maximize2, Search } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "@/components/shell/notification-bell";
import { prisma } from "@/lib/prisma";
import { getAuthContext, DEFAULT_TENANT } from "@/lib/auth-context";

export async function Topbar() {
  const ctx = await getAuthContext();
  const recipient = ctx.userId ?? DEFAULT_TENANT;
  const unread = await prisma.notification
    .count({
      where: {
        isRead: false,
        recipient: { in: [recipient, DEFAULT_TENANT] },
      },
    })
    .catch(() => 0);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200/70 bg-white/85 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            placeholder="Search tenders, vendors, clauses…"
            className="w-full rounded-xl border border-ink-200/70 bg-white py-2 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-100"
          />
        </div>
      </div>
      <NotificationBell unread={unread} />
      <Link
        href="#"
        className="hidden h-9 w-9 items-center justify-center rounded-xl border border-ink-200/70 bg-white text-ink-500 transition hover:text-ink-800 sm:grid"
        aria-label="Fullscreen"
      >
        <Maximize2 className="h-4 w-4" />
      </Link>
    </header>
  );
}
