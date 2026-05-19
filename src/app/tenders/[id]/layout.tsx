import Link from "next/link";
import { notFound } from "next/navigation";
import { getTender } from "@/lib/data";
import { StageBadge } from "@/components/ui/stage-badge";
import { TenderTabs } from "@/components/tender/tender-tabs";
import { fmtDate, fmtMoney } from "@/lib/utils";
import {
  ChevronLeft,
  Download,
  Share2,
  UserPlus,
  MoreHorizontal,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";

export default async function TenderLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const tender = await getTender(params.id);
  if (!tender) notFound();

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-5">
      <Link
        href="/tenders"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800"
      >
        <ChevronLeft className="h-4 w-4" /> Tenders ·{" "}
        <span className="text-ink-700">{tender.name}</span>
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink-900">
              {tender.name}
            </h1>
            <span className="pill-violet">{tender.reference}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[12px] text-ink-500">
            <StageBadge stage={tender.stage} />
            <span>{tender.category}</span>
            <span>·</span>
            <span>Budget {fmtMoney(tender.budget, tender.currency, true)}</span>
            <span>·</span>
            <span>Closes {fmtDate(tender.closingAt)}</span>
            <span>·</span>
            <span>Owner: {tender.ownerName}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-xl border border-ink-200/70 bg-white p-0.5 shadow-soft">
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-700">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:text-ink-800">
              <List className="h-4 w-4" />
            </button>
          </div>
          <button className="btn-ghost">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="btn-ghost">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="btn-ghost">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="btn-primary">
            <UserPlus className="h-4 w-4" /> Invite
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-xl border border-ink-200/70 bg-white text-ink-500 hover:text-ink-800">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      <TenderTabs id={tender.id} />

      <div>{children}</div>
    </div>
  );
}
