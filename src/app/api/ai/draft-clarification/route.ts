import { NextResponse } from "next/server";
import { z } from "zod";
import { aiEnabled } from "@/lib/env";
import { anthropic, MODEL, extractJson } from "@/lib/anthropic";

const Body = z.object({
  tenderName: z.string().min(1),
  context: z.string().optional(),
});

const SYSTEM = `You are an experienced procurement professional drafting clarification questions to a single vendor as part of a competitive tender evaluation. Your role:
- Surface specific gaps, deviations or ambiguities — never make commercial decisions.
- Be precise, polite and unambiguous. Reference the RFP clause where appropriate.
- Never invent facts: if information isn't provided, ask the question instead of asserting.
- Output strict JSON: { "subject": string, "questions": [string, ...] } — 3 to 5 questions.`;

type Drafted = { subject: string; questions: string[] };

const MOCK: Drafted = {
  subject:
    "Round 2 clarifications — please respond by Friday COB",
  questions: [
    "Please confirm whether the proposed Liability cap can be aligned to the RFP's minimum of 100% of contract value. If not, set out an alternative risk allocation acceptable to the Service Provider.",
    "Your commercial submission proposes an advance payment of 30%. Please confirm willingness to align with the RFP's cap of 10% (against an advance payment bank guarantee), or justify why a higher advance is required.",
    "The bid validity offered is 90 days. Please extend validity to 120 days, in line with the RFP, and reissue the price schedule confirming no commercial variation.",
    "Please clarify how data residency for tier-1 workloads will be enforced post-cutover — referencing the specific cloud region(s), backup destinations and any third-party processors involved.",
    "Provide a definitive local-content commitment as a percentage of total contract value, separated by Year 1 capex and Years 1–2 opex, and the methodology used to verify in-country spend.",
  ],
};

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { tenderName, context } = parsed.data;

  if (!aiEnabled()) {
    return NextResponse.json({ ...MOCK, source: "mock" });
  }

  try {
    const message = await anthropic().messages.create({
      model: MODEL(),
      max_tokens: 1200,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Tender: ${tenderName}\n\nContext from the evaluation panel:\n${
            context ??
            "High-severity flags: liability cap below RFP minimum, advance payment above RFP cap, bid validity below RFP minimum. Open questions on data residency and local content."
          }\n\nDraft a Round 2 clarification letter. Return strict JSON only.`,
        },
      ],
    });
    const data = extractJson<Drafted>(message);
    return NextResponse.json({ ...data, source: "claude" });
  } catch (err) {
    console.error("[ai] clarification draft failed", err);
    // Graceful fallback so the demo never breaks
    return NextResponse.json({ ...MOCK, source: "mock-fallback" });
  }
}
