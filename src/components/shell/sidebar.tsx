import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthContext, DEFAULT_TENANT } from "@/lib/auth-context";
import { SidebarNav } from "@/components/shell/sidebar-nav";

export async function Sidebar() {
  const ctx = await getAuthContext();
  const recipient = ctx.userId ?? DEFAULT_TENANT;
  const [unread, tenderCount] = await Promise.all([
    prisma.notification
      .count({
        where: {
          isRead: false,
          recipient: { in: [recipient, DEFAULT_TENANT] },
        },
      })
      .catch(() => 0),
    prisma.tender.count().catch(() => 0),
  ]);

  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-ink-200/70 bg-white/80 backdrop-blur lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <Logo />
        <Link href="/" className="text-[17px] font-semibold tracking-tight text-ink-900">
          BidLens
        </Link>
      </div>
      <SidebarNav inboxUnread={unread} tenderCount={tenderCount} />
    </aside>
  );
}

function Logo() {
  return (
    <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-[0_8px_20px_-8px_rgba(124,92,255,0.6)]">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </span>
  );
}
