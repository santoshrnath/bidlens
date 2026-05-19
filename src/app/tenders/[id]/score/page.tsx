import { getTender } from "@/lib/data";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { EvaluatorWorkspace } from "@/components/tender/evaluator-workspace";
import { toArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyScoringPage({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  if (!tender) notFound();
  const ctx = await getAuthContext();

  // For the demo, identify the evaluator as the first non-submitted one if the
  // user isn't matched to one (so the screen is always live with the seed).
  const myEvaluator =
    tender.committee.find(
      (e) => ctx.email && e.email.toLowerCase() === ctx.email.toLowerCase(),
    ) ??
    tender.committee.find((e) => !e.hasSubmitted) ??
    tender.committee[0];

  const criteria = toArray<any>(tender.schema?.evaluationCriteria as any);

  return (
    <EvaluatorWorkspace
      tenderId={tender.id}
      tenderName={tender.name}
      evaluator={
        myEvaluator
          ? {
              id: myEvaluator.id,
              fullName: myEvaluator.fullName,
              role: myEvaluator.role ?? "Evaluator",
              hasSubmitted: myEvaluator.hasSubmitted,
            }
          : null
      }
      criteria={criteria.map((c) => ({ key: c.id, label: c.name, weight: c.weight }))}
      bids={tender.bids.map((b) => ({
        id: b.id,
        vendorName: b.vendorName,
        vendorShortName: b.vendorShortName ?? b.vendorName,
        accentColor: b.accentColor,
        overallScore: b.overallScore,
        complianceLevel: b.complianceLevel,
        strengths: (b.strengths as string[]) ?? [],
        weaknesses: (b.weaknesses as string[]) ?? [],
      }))}
    />
  );
}
