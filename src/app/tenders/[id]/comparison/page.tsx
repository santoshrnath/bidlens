import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { ComparisonMatrix } from "@/components/tender/comparison-matrix";
import { toArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ComparisonPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { masked?: string };
}) {
  const tender = await getTender(params.id);
  if (!tender) notFound();
  const masked = searchParams?.masked === "1";

  const scope = toArray<any>(tender.schema?.scopeItems as any);
  const bids = tender.bids;
  // Order: recommended first, then by overall score desc
  const orderedBids = [...bids].sort((a, b) => {
    if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
    return (b.overallScore ?? 0) - (a.overallScore ?? 0);
  });

  return (
    <ComparisonMatrix
      tenderId={tender.id}
      tenderName={tender.name}
      reference={tender.reference}
      masked={masked}
      weights={{
        technical: tender.weightTechnical,
        commercial: tender.weightCommercial,
        delivery: tender.weightDelivery,
        localContent: tender.weightLocalContent,
      }}
      scope={scope}
      bids={orderedBids.map((b, idx) => ({
        id: b.id,
        vendorName: masked ? `Bidder ${String.fromCharCode(65 + idx)}` : b.vendorName,
        vendorShortName: masked
          ? `Bidder ${String.fromCharCode(65 + idx)}`
          : b.vendorShortName ?? b.vendorName,
        accentColor: masked ? "#94a3b8" : b.accentColor,
        isRecommended: b.isRecommended,
        complianceLevel: b.complianceLevel,
        overallScore: b.overallScore,
        totalPrice: b.totalPrice,
        currency: b.currency,
        validityDays: b.validityDays,
        responses: (b.responses as any) ?? {},
        risks: b.risks.map((r) => ({
          id: r.id,
          category: r.category,
          severity: r.severity,
          title: r.title,
          description: r.description,
          clauseRef: r.clauseRef,
          vendorPosition: r.vendorPosition,
          schemaRequirement: r.schemaRequirement,
          pageRef: r.pageRef,
        })),
      }))}
    />
  );
}
