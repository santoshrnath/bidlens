import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { ApprovalChain } from "@/components/tender/approval-chain";
import { fmtMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ApprovalPage({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  if (!tender) notFound();

  if (!tender.award) {
    return (
      <div className="rounded-2xl border border-ink-200/70 bg-white p-8 text-center text-[13px] text-ink-500 shadow-soft">
        No award recommendation submitted yet.
      </div>
    );
  }

  const recommended = tender.bids.find((b) => b.id === tender.award!.recommendedBidId);

  return (
    <ApprovalChain
      tenderId={tender.id}
      tenderName={tender.name}
      reference={tender.reference}
      recommendation={{
        vendorName: recommended?.vendorName ?? "—",
        vendorAccent: recommended?.accentColor ?? null,
        contractValue: tender.award.contractValue ?? recommended?.totalPrice ?? 0,
        currency: tender.award.currency ?? recommended?.currency ?? "USD",
        rationale: tender.award.rationale ?? "",
        requestedBy: tender.award.requestedBy ?? "Procurement Lead",
        contractValueFmt: fmtMoney(
          tender.award.contractValue ?? recommended?.totalPrice ?? 0,
          tender.award.currency ?? recommended?.currency ?? "USD",
          false,
        ),
      }}
      steps={tender.award.approvalSteps.map((s) => ({
        id: s.id,
        order: s.order,
        approverName: s.approverName,
        approverRole: s.approverRole,
        approverEmail: s.approverEmail,
        threshold: s.threshold,
        decision: s.decision,
        decidedAt: s.decidedAt,
        comment: s.comment,
      }))}
    />
  );
}
