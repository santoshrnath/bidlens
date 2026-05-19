// ─────────────────────────────────────────────────────────────────────────────
// BidLens — synthetic seed
// ─────────────────────────────────────────────────────────────────────────────
// Produces a rich, partner-ready demo dataset:
//   1 hero tender (Enterprise Data Center Migration) — fully populated
//   + 4 supporting tenders across stages
//   + vendor library, clause library, tender templates
// Run with `npm run seed` (after `prisma db push`).
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("◆ BidLens seed");

  // Idempotent: wipe demo data first
  await prisma.auditEntry.deleteMany();
  await prisma.awardRecommendation.deleteMany();
  await prisma.clarificationItem.deleteMany();
  await prisma.clarificationRound.deleteMany();
  await prisma.score.deleteMany();
  await prisma.evaluator.deleteMany();
  await prisma.riskFlag.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.comparisonSchema.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.clauseTemplate.deleteMany();
  await prisma.tenderTemplate.deleteMany();

  // ── Vendor library ────────────────────────────────────────────────────────
  const vendors: Prisma.VendorCreateManyInput[] = [
    {
      name: "TechNova Solutions",
      shortName: "TechNova",
      country: "United Arab Emirates",
      category: "Cloud & Infrastructure",
      rating: 4.7,
      bidsRun: 12,
      awardsWon: 8,
      accentColor: "#7c5cff",
      notes: "Strong cloud migration track record, premium pricing.",
    },
    {
      name: "Cloudify Systems",
      shortName: "Cloudify",
      country: "Saudi Arabia",
      category: "Cloud & Infrastructure",
      rating: 4.1,
      bidsRun: 9,
      awardsWon: 3,
      accentColor: "#0ea5e9",
      notes: "Competitive pricing, aggressive T&Cs (capped liability).",
    },
    {
      name: "NextGen Infra",
      shortName: "NextGen",
      country: "India",
      category: "Cloud & Infrastructure",
      rating: 4.3,
      bidsRun: 11,
      awardsWon: 4,
      accentColor: "#22c55e",
      notes: "Automation-first methodology, dependable delivery.",
    },
    {
      name: "DataCore Services",
      shortName: "DataCore",
      country: "United Kingdom",
      category: "Data Centre",
      rating: 4.0,
      bidsRun: 7,
      awardsWon: 2,
      accentColor: "#f59e0b",
      notes: "Strong hybrid offering, longer delivery timelines.",
    },
    {
      name: "ComputeHub",
      shortName: "ComputeHub",
      country: "Egypt",
      category: "Cloud & Infrastructure",
      rating: 3.4,
      bidsRun: 6,
      awardsWon: 1,
      accentColor: "#ef4444",
      notes: "Lowest cost option but high-risk T&Cs.",
    },
    {
      name: "Atlas Builders",
      shortName: "Atlas",
      country: "United Arab Emirates",
      category: "Construction",
      rating: 4.5,
      bidsRun: 14,
      awardsWon: 9,
      accentColor: "#6366f1",
    },
    {
      name: "Saffron Catering",
      shortName: "Saffron",
      country: "United Arab Emirates",
      category: "Facilities",
      rating: 4.2,
      bidsRun: 5,
      awardsWon: 2,
      accentColor: "#ec4899",
    },
    {
      name: "Verdant Security",
      shortName: "Verdant",
      country: "Qatar",
      category: "Cyber",
      rating: 4.6,
      bidsRun: 8,
      awardsWon: 5,
      accentColor: "#14b8a6",
    },
  ];
  await prisma.vendor.createMany({ data: vendors });

  // ── Clause library ────────────────────────────────────────────────────────
  await prisma.clauseTemplate.createMany({
    data: [
      {
        category: "Liability & Indemnity",
        title: "Unlimited liability for IP infringement",
        body: "The Service Provider shall indemnify the Client without monetary cap for any losses, costs and damages arising from third-party intellectual property infringement claims relating to the Services or Deliverables.",
        riskLevel: "LOW",
        tags: ["liability", "ip", "indemnity"],
      },
      {
        category: "Liability & Indemnity",
        title: "Liability cap at 100% of contract value",
        body: "The total aggregate liability of the Service Provider under this Agreement shall be capped at one hundred percent (100%) of the total Contract Value.",
        riskLevel: "MEDIUM",
        tags: ["liability", "cap"],
      },
      {
        category: "Payment Terms",
        title: "Milestone-based payments, 10% advance",
        body: "Payments shall be made against achievement of agreed milestones. An advance payment not exceeding ten percent (10%) of the Contract Value shall be paid against an Advance Payment Bank Guarantee.",
        riskLevel: "LOW",
        tags: ["payment", "milestones"],
      },
      {
        category: "Warranty",
        title: "12-month warranty post go-live",
        body: "The Service Provider warrants the Services and Deliverables for a period of twelve (12) months from the date of formal acceptance.",
        riskLevel: "LOW",
        tags: ["warranty"],
      },
      {
        category: "Termination",
        title: "Termination for convenience with 30 days notice",
        body: "The Client may terminate this Agreement for convenience upon thirty (30) days prior written notice to the Service Provider.",
        riskLevel: "LOW",
        tags: ["termination"],
      },
      {
        category: "Force Majeure",
        title: "Standard force majeure (excludes commercial hardship)",
        body: "Neither Party shall be liable for delays caused by events beyond reasonable control. Commercial hardship, exchange rate fluctuations and labour disputes are expressly excluded.",
        riskLevel: "LOW",
        tags: ["force-majeure"],
      },
    ],
  });

  // ── Tender templates ──────────────────────────────────────────────────────
  await prisma.tenderTemplate.createMany({
    data: [
      {
        name: "Cloud / Data Centre Services",
        category: "IT",
        description:
          "Pre-loaded schema for cloud, infra and data-centre tenders — covers solution approach, migration, security, SLA and exit assistance.",
      },
      {
        name: "Facilities & FM Services",
        category: "Facilities",
        description:
          "Pre-loaded schema for annual FM, hard & soft services and catering contracts.",
      },
      {
        name: "Construction Works (FIDIC-aligned)",
        category: "Construction",
        description:
          "Schema with FIDIC-style scope of work, milestones, performance bonds and warranty.",
      },
      {
        name: "Professional Services",
        category: "Advisory",
        description:
          "Schema for consulting and advisory tenders — methodology, key personnel, day rates, deliverables.",
      },
    ],
  });

  // ── Hero tender ───────────────────────────────────────────────────────────
  const tender = await prisma.tender.create({
    data: {
      name: "Enterprise Data Center Migration",
      reference: "RFP-2034-18 (Round 2)",
      category: "IT — Cloud & Infrastructure",
      client: "Acme Corporation",
      stage: "IN_EVALUATION",
      budget: 2_500_000,
      currency: "USD",
      issuedAt: new Date("2026-03-12"),
      closingAt: new Date("2026-04-25"),
      ownerName: "Arjun Sharma",
      ownerEmail: "arjun.sharma@acme.example",
      rfpFileName: "RFP-2034-18-DataCenter-Migration.pdf",
      rfpFileSize: 4_320_000,
      weightTechnical: 40,
      weightCommercial: 30,
      weightDelivery: 20,
      weightLocalContent: 10,
      description:
        "Migrate 38 production workloads across two on-prem facilities into a multi-region, multi-AZ cloud landing zone with zero-downtime cutover for tier-1 systems. Includes 24-month run support and exit assistance.",
    },
  });

  await prisma.comparisonSchema.create({
    data: {
      tenderId: tender.id,
      version: 3,
      approvedBy: "Arjun Sharma",
      approvedAt: new Date("2026-03-22"),
      scopeItems: [
        {
          id: "1.1",
          code: "1.1",
          title: "Solution Approach",
          requirement:
            "Describe your overall approach to delivering the solution, including methodology and key principles.",
          weight: 10,
          mandatory: true,
        },
        {
          id: "1.2",
          code: "1.2",
          title: "Infrastructure Design",
          requirement:
            "Detailed cloud landing zone design covering networking, identity, observability and DR.",
          weight: 12,
          mandatory: true,
        },
        {
          id: "1.3",
          code: "1.3",
          title: "Migration Plan & Cutover",
          requirement:
            "Wave-based migration plan covering 38 workloads with zero-downtime cutover for tier-1.",
          weight: 10,
          mandatory: true,
        },
        {
          id: "1.4",
          code: "1.4",
          title: "Security & Compliance",
          requirement: "ISO 27001 + SOC 2 controls, regional data residency.",
          weight: 8,
          mandatory: true,
        },
        {
          id: "2.1",
          code: "2.1",
          title: "Pricing Structure",
          requirement: "Provide detailed pricing breakdown by workload and year.",
          weight: 10,
          mandatory: true,
        },
        {
          id: "3.1",
          code: "3.1",
          title: "Liability Cap",
          requirement: "What is the limitation of liability?",
          weight: 6,
          mandatory: true,
        },
        {
          id: "3.2",
          code: "3.2",
          title: "Payment Terms",
          requirement: "Describe proposed payment terms and any advance.",
          weight: 6,
          mandatory: true,
        },
        {
          id: "3.3",
          code: "3.3",
          title: "Warranty Period",
          requirement: "Warranty for services and deliverables.",
          weight: 4,
          mandatory: true,
        },
        {
          id: "4.1",
          code: "4.1",
          title: "Local Content",
          requirement: "Proportion of in-country resources, training and IP localisation.",
          weight: 10,
          mandatory: false,
        },
      ],
      evaluationCriteria: [
        { id: "technical", name: "Technical", weight: 40 },
        { id: "commercial", name: "Commercial", weight: 30 },
        { id: "delivery", name: "Delivery", weight: 20 },
        { id: "localContent", name: "Local Content", weight: 10 },
      ],
      pricingStructure: {
        basis: "Lump sum + run-rate",
        currency: "USD",
        lines: [
          { code: "CAPEX", label: "Migration (one-off)", unit: "lump sum" },
          { code: "OPEX", label: "Run support — Year 1", unit: "annual" },
          { code: "OPEX", label: "Run support — Year 2", unit: "annual" },
          { code: "EXIT", label: "Exit assistance", unit: "lump sum" },
        ],
      },
      mandatoryTCs: [
        {
          id: "TC1",
          category: "Liability",
          requirement: "Liability cap shall not be less than 100% of contract value.",
          sourceRef: "RFP §12.1",
        },
        {
          id: "TC2",
          category: "Payment",
          requirement: "Advance payment capped at 10% of contract value, against bank guarantee.",
          sourceRef: "RFP §13.4",
        },
        {
          id: "TC3",
          category: "Warranty",
          requirement: "Minimum 12-month warranty post acceptance.",
          sourceRef: "RFP §14.2",
        },
        {
          id: "TC4",
          category: "IP",
          requirement: "Client retains IP in deliverables and configurations.",
          sourceRef: "RFP §16.1",
        },
        {
          id: "TC5",
          category: "Data residency",
          requirement: "All customer data shall remain within UAE region.",
          sourceRef: "RFP §17.3",
        },
      ],
    },
  });

  // ── Committee ─────────────────────────────────────────────────────────────
  const committee = await Promise.all(
    [
      {
        fullName: "Arjun Sharma",
        email: "arjun.sharma@acme.example",
        role: "Procurement Manager",
        weightShare: 0.25,
        hasSubmitted: true,
      },
      {
        fullName: "Mariam Al Hosani",
        email: "mariam.alhosani@acme.example",
        role: "Technical Lead",
        weightShare: 0.3,
        hasSubmitted: true,
      },
      {
        fullName: "Fahad Al Mansouri",
        email: "fahad.almansouri@acme.example",
        role: "Finance",
        weightShare: 0.2,
        hasSubmitted: true,
      },
      {
        fullName: "Priya Iyer",
        email: "priya.iyer@acme.example",
        role: "Legal",
        weightShare: 0.1,
        hasSubmitted: false,
      },
      {
        fullName: "Daniel Roberts",
        email: "daniel.roberts@acme.example",
        role: "Committee Chair",
        weightShare: 0.15,
        hasSubmitted: false,
      },
    ].map((e) =>
      prisma.evaluator.create({
        data: { ...e, tenderId: tender.id },
      }),
    ),
  );

  // ── Bids ──────────────────────────────────────────────────────────────────
  const bidSeeds = [
    {
      vendorName: "TechNova Solutions",
      vendorShortName: "TechNova",
      accentColor: "#7c5cff",
      submittedAt: new Date("2026-04-22"),
      validityDays: 120,
      currency: "USD",
      totalPrice: 2_100_000,
      isRecommended: true,
      overallScore: 8.6,
      complianceLevel: "Compliant",
      scoreTechnical: 9.0,
      scoreCommercial: 8.2,
      scoreDelivery: 8.5,
      scoreLocalContent: 8.0,
      strengths: [
        "Strongest technical methodology (phased, zero-downtime)",
        "Liability cap at 10% of contract value (standard)",
        "Best-in-class observability and DR design",
        "Most experienced cloud migration team referenced",
      ],
      weaknesses: [
        "Highest run-rate cost (Year 2)",
        "Local content marginally below target",
      ],
      pricingLines: [
        { label: "Migration (CAPEX)", qty: 1, unit: "lump", unitPrice: 980_000, total: 980_000, currency: "USD" },
        { label: "Run support — Year 1", qty: 1, unit: "annual", unitPrice: 460_000, total: 460_000, currency: "USD" },
        { label: "Run support — Year 2", qty: 1, unit: "annual", unitPrice: 510_000, total: 510_000, currency: "USD" },
        { label: "Exit assistance", qty: 1, unit: "lump", unitPrice: 150_000, total: 150_000, currency: "USD" },
      ],
      responses: {
        "1.1": {
          excerpt: "Comprehensive phased migration approach with zero downtime for tier-1, validated on three similar regional programmes.",
          sourceRef: "Solution_Approach.pdf · p.5",
        },
        "1.2": {
          excerpt: "Multi-AZ landing zone with hub-and-spoke transit, central observability and FedRAMP-aligned guardrails.",
          sourceRef: "Solution_Approach.pdf · p.12",
        },
        "2.1": { excerpt: "Total Price (USD) 2,100,000 — breakdown attached.", sourceRef: "Pricing.xlsx · S1" },
        "3.1": { excerpt: "Liability capped at 10% of contract value. Standard market position.", sourceRef: "Commercial.pdf · §12.1" },
        "3.2": { excerpt: "Net 30 against milestone certification. Advance 10% against bank guarantee.", sourceRef: "Commercial.pdf · §13" },
        "3.3": { excerpt: "12 months from formal acceptance.", sourceRef: "Commercial.pdf · §14" },
        "4.1": { excerpt: "62% in-country resourcing; UAE delivery hub in DIFC.", sourceRef: "Annex_LocalContent.pdf · p.3" },
      },
      risks: [
        {
          category: "Local Content",
          clauseRef: "Annex E",
          severity: "LOW",
          title: "Local content marginally below 65% target",
          description: "Vendor commits 62% in-country resourcing vs RFP target of ≥65%.",
        },
      ] as const,
    },
    {
      vendorName: "Cloudify Systems",
      vendorShortName: "Cloudify",
      accentColor: "#0ea5e9",
      submittedAt: new Date("2026-04-23"),
      validityDays: 90,
      currency: "USD",
      totalPrice: 2_550_000,
      overallScore: 7.9,
      complianceLevel: "Partially compliant",
      scoreTechnical: 8.4,
      scoreCommercial: 7.1,
      scoreDelivery: 8.2,
      scoreLocalContent: 7.0,
      strengths: [
        "Agile migration methodology, automation-first",
        "Strongest infrastructure design score from technical panel",
      ],
      weaknesses: [
        "Liability capped at 5% — well below RFP minimum",
        "Advance payment 30% — well above 10% RFP cap",
        "Validity only 90 days",
      ],
      pricingLines: [
        { label: "Migration (CAPEX)", qty: 1, unit: "lump", unitPrice: 1_180_000, total: 1_180_000, currency: "USD" },
        { label: "Run support — Year 1", qty: 1, unit: "annual", unitPrice: 580_000, total: 580_000, currency: "USD" },
        { label: "Run support — Year 2", qty: 1, unit: "annual", unitPrice: 620_000, total: 620_000, currency: "USD" },
        { label: "Exit assistance", qty: 1, unit: "lump", unitPrice: 170_000, total: 170_000, currency: "USD" },
      ],
      responses: {
        "1.1": { excerpt: "Agile migration methodology with automation-first validation through every wave.", sourceRef: "Solution_Approach.pdf · p.4" },
        "1.2": { excerpt: "Active-active landing zone with cross-region DR and managed observability.", sourceRef: "Solution_Approach.pdf · p.9" },
        "2.1": { excerpt: "Total Price (USD) 2,550,000.", sourceRef: "Pricing.xlsx · S1" },
        "3.1": { excerpt: "Total liability shall not exceed five percent (5%) of total contract value.", sourceRef: "Commercial.pdf · §12.1" },
        "3.2": { excerpt: "30% advance against signed agreement. Balance milestone-based.", sourceRef: "Commercial.pdf · §13" },
        "3.3": { excerpt: "12 months from go-live.", sourceRef: "Commercial.pdf · §14" },
        "4.1": { excerpt: "55% in-country, Riyadh hub.", sourceRef: "Annex_LocalContent.pdf · p.2" },
      },
      risks: [
        {
          category: "Liability & Indemnity",
          clauseRef: "§12.1",
          severity: "HIGH",
          title: "Liability cap at 5% of contract value",
          description:
            "The total liability of the Service Provider shall not exceed five percent (5%) of the total contract value. RFP requires no less than 100%.",
          vendorPosition:
            "The total liability of the Service Provider to the Client arising out of or in connection with this Agreement shall not exceed five percent (5%) of the total contract value.",
          schemaRequirement: "RFP §12.1 — Minimum 100% of contract value.",
        },
        {
          category: "Payment Terms",
          clauseRef: "§13",
          severity: "HIGH",
          title: "Advance payment 30%",
          description: "Vendor requests 30% advance; RFP caps advance at 10% with bank guarantee.",
        },
        {
          category: "Validity",
          clauseRef: "§4.2",
          severity: "MEDIUM",
          title: "Bid validity only 90 days",
          description: "Validity shorter than the 120 days requested in the RFP.",
        },
      ] as const,
    },
    {
      vendorName: "NextGen Infra",
      vendorShortName: "NextGen",
      accentColor: "#22c55e",
      submittedAt: new Date("2026-04-21"),
      validityDays: 120,
      currency: "USD",
      totalPrice: 2_300_000,
      overallScore: 7.2,
      complianceLevel: "Compliant",
      scoreTechnical: 7.5,
      scoreCommercial: 7.8,
      scoreDelivery: 7.0,
      scoreLocalContent: 6.4,
      strengths: [
        "Hybrid cloud/on-prem approach, lower vendor lock-in",
        "Standard liability at 100%, in line with RFP",
      ],
      weaknesses: [
        "Less mature observability stack",
        "Local content well below 65% target",
      ],
      pricingLines: [
        { label: "Migration (CAPEX)", qty: 1, unit: "lump", unitPrice: 1_050_000, total: 1_050_000, currency: "USD" },
        { label: "Run support — Year 1", qty: 1, unit: "annual", unitPrice: 520_000, total: 520_000, currency: "USD" },
        { label: "Run support — Year 2", qty: 1, unit: "annual", unitPrice: 560_000, total: 560_000, currency: "USD" },
        { label: "Exit assistance", qty: 1, unit: "lump", unitPrice: 170_000, total: 170_000, currency: "USD" },
      ],
      responses: {
        "1.1": { excerpt: "Hybrid approach leveraging existing on-prem investments alongside cloud migration.", sourceRef: "Solution_Approach.pdf · p.6" },
        "3.1": { excerpt: "Liability capped at 100% of contract value. Aligned with RFP.", sourceRef: "Commercial.pdf · §12.1" },
        "4.1": { excerpt: "48% in-country resources.", sourceRef: "Annex_LocalContent.pdf · p.2" },
      },
      risks: [
        {
          category: "Local Content",
          clauseRef: "Annex E",
          severity: "MEDIUM",
          title: "Local content below 65% target",
          description: "Vendor commits 48% in-country resourcing vs RFP target of ≥65%.",
        },
        {
          category: "IP",
          clauseRef: "§16.1",
          severity: "MEDIUM",
          title: "IP ownership not clearly defined",
          description: "IP clauses do not clearly assign ownership of configurations and scripts to client.",
        },
      ] as const,
    },
    {
      vendorName: "DataCore Services",
      vendorShortName: "DataCore",
      accentColor: "#f59e0b",
      submittedAt: new Date("2026-04-22"),
      validityDays: 120,
      currency: "USD",
      totalPrice: 2_800_000,
      overallScore: 6.8,
      complianceLevel: "Compliant",
      scoreTechnical: 7.0,
      scoreCommercial: 6.0,
      scoreDelivery: 7.5,
      scoreLocalContent: 6.5,
      strengths: ["Long-standing data centre experience in the UAE"],
      weaknesses: ["Most expensive option", "Limited automation in migration plan"],
      pricingLines: [
        { label: "Migration (CAPEX)", qty: 1, unit: "lump", unitPrice: 1_280_000, total: 1_280_000, currency: "USD" },
        { label: "Run support — Year 1", qty: 1, unit: "annual", unitPrice: 660_000, total: 660_000, currency: "USD" },
        { label: "Run support — Year 2", qty: 1, unit: "annual", unitPrice: 690_000, total: 690_000, currency: "USD" },
        { label: "Exit assistance", qty: 1, unit: "lump", unitPrice: 170_000, total: 170_000, currency: "USD" },
      ],
      responses: {
        "1.1": { excerpt: "Standard migration approach with best-effort execution. Vendor will assign a dedicated programme manager.", sourceRef: "Solution_Approach.pdf · p.5" },
        "3.1": { excerpt: "Unlimited liability for IP infringement; otherwise capped at 200% of contract value.", sourceRef: "Commercial.pdf · §12.1" },
      },
      risks: [
        {
          category: "SLA",
          clauseRef: "Annex F",
          severity: "MEDIUM",
          title: "SLA penalties not clearly defined",
          description: "Service credits referenced but not quantified.",
        },
      ] as const,
    },
    {
      vendorName: "ComputeHub",
      vendorShortName: "ComputeHub",
      accentColor: "#ef4444",
      submittedAt: new Date("2026-04-24"),
      validityDays: 60,
      currency: "USD",
      totalPrice: 1_900_000,
      overallScore: 6.5,
      complianceLevel: "Non-compliant",
      scoreTechnical: 6.0,
      scoreCommercial: 8.5,
      scoreDelivery: 5.0,
      scoreLocalContent: 6.0,
      strengths: ["Lowest total contract value"],
      weaknesses: [
        "Liability capped at 2% of contract value",
        "Bid validity only 60 days",
        "Warranty < 12 months",
      ],
      pricingLines: [
        { label: "Migration (CAPEX)", qty: 1, unit: "lump", unitPrice: 820_000, total: 820_000, currency: "USD" },
        { label: "Run support — Year 1", qty: 1, unit: "annual", unitPrice: 440_000, total: 440_000, currency: "USD" },
        { label: "Run support — Year 2", qty: 1, unit: "annual", unitPrice: 480_000, total: 480_000, currency: "USD" },
        { label: "Exit assistance", qty: 1, unit: "lump", unitPrice: 160_000, total: 160_000, currency: "USD" },
      ],
      responses: {
        "1.1": { excerpt: "Standard migration approach with best-effort execution.", sourceRef: "Solution_Approach.pdf · p.4" },
        "3.1": { excerpt: "Liability shall in no event exceed two percent (2%) of the total contract value.", sourceRef: "Commercial.pdf · §12.1" },
        "3.3": { excerpt: "Warranty: six (6) months from acceptance.", sourceRef: "Commercial.pdf · §14" },
      },
      risks: [
        {
          category: "Liability & Indemnity",
          clauseRef: "§12.1",
          severity: "HIGH",
          title: "Liability cap at 2% of contract value",
          description: "Cap is far below the 100% minimum required by the RFP. Non-compliant.",
          vendorPosition:
            "Liability shall in no event exceed two percent (2%) of the total contract value.",
          schemaRequirement: "RFP §12.1 — Minimum 100% of contract value.",
        },
        {
          category: "Warranty",
          clauseRef: "§14",
          severity: "MEDIUM",
          title: "Warranty period < 12 months",
          description: "Warranty only 6 months — below the 12-month RFP minimum.",
        },
        {
          category: "Validity",
          clauseRef: "§4.2",
          severity: "HIGH",
          title: "Bid validity only 60 days",
          description: "Validity well short of the 120 days requested. Will expire before scheduled award.",
        },
      ] as const,
    },
  ];

  const bids = [] as { id: string; name: string }[];
  for (const seed of bidSeeds) {
    const bid = await prisma.bid.create({
      data: {
        tenantId: "default",
        tenderId: tender.id,
        status: "READY",
        vendorName: seed.vendorName,
        vendorShortName: seed.vendorShortName,
        accentColor: seed.accentColor,
        submittedAt: seed.submittedAt,
        validityDays: seed.validityDays,
        currency: seed.currency,
        totalPrice: seed.totalPrice,
        isRecommended: !!seed.isRecommended,
        overallScore: seed.overallScore,
        complianceLevel: seed.complianceLevel,
        scoreTechnical: seed.scoreTechnical,
        scoreCommercial: seed.scoreCommercial,
        scoreDelivery: seed.scoreDelivery,
        scoreLocalContent: seed.scoreLocalContent,
        strengths: seed.strengths as any,
        weaknesses: seed.weaknesses as any,
        responses: seed.responses as any,
        pricingLines: seed.pricingLines as any,
        fileName: `${seed.vendorShortName}_Bid.pdf`,
        fileSize: 2_400_000,
        pageCount: 78,
      },
    });
    bids.push({ id: bid.id, name: seed.vendorName });
    for (const r of seed.risks) {
      await prisma.riskFlag.create({
        data: {
          tenderId: tender.id,
          bidId: bid.id,
          category: r.category,
          clauseRef: r.clauseRef,
          severity: r.severity as any,
          title: r.title,
          description: r.description,
          vendorPosition: (r as any).vendorPosition,
          schemaRequirement: (r as any).schemaRequirement,
          pageRef: "p.35 of 78",
        },
      });
    }
  }

  // Scores from each committee member, per criterion, per bid
  const valuesByCriterion: Record<string, number[]> = {
    technical: [9.0, 8.4, 7.5, 7.0, 6.0],
    commercial: [8.2, 7.1, 7.8, 6.0, 8.5],
    delivery: [8.5, 8.2, 7.0, 7.5, 5.0],
    localContent: [8.0, 7.0, 6.4, 6.5, 6.0],
  };
  const jitter = () => (Math.random() - 0.5) * 0.8;
  for (const evalr of committee) {
    if (!evalr.hasSubmitted) continue;
    for (let i = 0; i < bids.length; i++) {
      for (const crit of ["technical", "commercial", "delivery", "localContent"]) {
        const base = valuesByCriterion[crit][i];
        await prisma.score.create({
          data: {
            tenderId: tender.id,
            bidId: bids[i].id,
            evaluatorId: evalr.id,
            criterion: crit,
            value: Math.max(0, Math.min(10, base + jitter())),
            comment:
              crit === "technical" && i === 0
                ? "Strongest methodology and DR design across the panel."
                : null,
          },
        });
      }
    }
  }

  // Clarification round
  const round = await prisma.clarificationRound.create({
    data: {
      tenderId: tender.id,
      number: 1,
      openedAt: new Date("2026-04-26"),
      note: "Round 1 clarifications issued following initial scoring.",
    },
  });
  await prisma.clarificationItem.createMany({
    data: [
      {
        roundId: round.id,
        bidId: bids[1].id,
        schemaItemRef: "3.1 Liability Cap",
        question:
          "Your proposal caps liability at 5% of contract value. Please confirm whether you can align with the RFP's 100% requirement, and propose alternative risk allocation if not.",
        status: "responded",
        response:
          "We can offer 25% of contract value, with carve-outs for IP infringement and breach of confidentiality.",
        respondedAt: new Date("2026-05-04"),
        changedItems: [
          { ref: "3.1", before: "5% liability cap", after: "25% liability cap, IP/confidentiality carve-outs" },
        ],
        raisedBy: "Arjun Sharma",
      },
      {
        roundId: round.id,
        bidId: bids[1].id,
        schemaItemRef: "3.2 Payment Terms",
        question:
          "Your proposal requires 30% advance. Please confirm whether you can comply with the 10% advance cap in the RFP.",
        status: "open",
        raisedBy: "Fahad Al Mansouri",
      },
      {
        roundId: round.id,
        bidId: bids[4].id,
        schemaItemRef: "3.3 Warranty",
        question:
          "Your proposal offers 6-month warranty. Please confirm willingness to align to the RFP's 12-month minimum.",
        status: "open",
        raisedBy: "Mariam Al Hosani",
      },
      {
        roundId: round.id,
        bidId: bids[2].id,
        schemaItemRef: "4.1 Local Content",
        question:
          "Your proposal commits 48% in-country resourcing. Please indicate the maximum local content achievable.",
        status: "responded",
        response: "We can lift in-country resourcing to 58%, contingent on extending Phase 1 by 4 weeks.",
        respondedAt: new Date("2026-05-06"),
        raisedBy: "Daniel Roberts",
      },
    ],
  });

  // Award recommendation (draft)
  await prisma.awardRecommendation.create({
    data: {
      tenderId: tender.id,
      recommendedBidId: bids[0].id,
      rationale:
        "TechNova Solutions delivered the strongest technical methodology, achieved a top overall score of 8.6 and is fully compliant with all mandatory T&Cs. Cloudify scored marginally above on infrastructure design but carries high liability and payment-terms risk that procurement is unwilling to absorb at this contract scale.",
      status: "submitted",
      requestedBy: "Arjun Sharma",
      contractValue: 2_100_000,
      currency: "USD",
      approvers: [
        { name: "Daniel Roberts", role: "Committee Chair", decision: "pending", at: null },
        { name: "Fahad Al Mansouri", role: "Finance", decision: "approved", at: "2026-05-10" },
      ],
    },
  });

  // Audit log (selected events, oldest first)
  const audit: { action: any; actor: string; actorRole?: string; target?: string; summary: string; createdAt: Date }[] = [
    {
      action: "TENDER_CREATED",
      actor: "Arjun Sharma",
      actorRole: "Procurement Manager",
      summary: "Tender created from template 'Cloud / Data Centre Services'.",
      createdAt: new Date("2026-03-10T09:12:00"),
    },
    {
      action: "RFP_UPLOADED",
      actor: "Arjun Sharma",
      actorRole: "Procurement Manager",
      summary: "RFP-2034-18 v2 uploaded (4.3 MB, 78 pages).",
      createdAt: new Date("2026-03-12T11:30:00"),
    },
    {
      action: "SCHEMA_GENERATED",
      actor: "Claude (Sonnet 4.6)",
      actorRole: "AI",
      summary: "Comparison schema v1 generated: 9 scope items, 5 mandatory T&Cs, 4 evaluation criteria.",
      createdAt: new Date("2026-03-12T11:34:00"),
    },
    {
      action: "SCHEMA_EDITED",
      actor: "Mariam Al Hosani",
      actorRole: "Technical Lead",
      summary: "Adjusted weights: Technical 40%, Commercial 30%, Delivery 20%, Local Content 10%.",
      createdAt: new Date("2026-03-15T14:05:00"),
    },
    {
      action: "SCHEMA_APPROVED",
      actor: "Arjun Sharma",
      actorRole: "Procurement Manager",
      summary: "Schema v3 approved and locked for bid evaluation.",
      createdAt: new Date("2026-03-22T09:00:00"),
    },
    {
      action: "BID_UPLOADED",
      actor: "Cloudify Systems",
      actorRole: "Vendor",
      summary: "Bid received: Cloudify Systems (78 pages, 2.4 MB).",
      createdAt: new Date("2026-04-23T16:45:00"),
    },
    {
      action: "RISK_FLAGGED",
      actor: "Claude (Sonnet 4.6)",
      actorRole: "AI",
      target: "Cloudify Systems — Clause §12.1",
      summary: "High-severity risk: liability capped at 5% of contract value (RFP requires ≥100%).",
      createdAt: new Date("2026-04-23T16:48:00"),
    },
    {
      action: "CLARIFICATION_RAISED",
      actor: "Arjun Sharma",
      actorRole: "Procurement Manager",
      target: "Cloudify Systems — Clause 3.1",
      summary: "Clarification raised on liability cap.",
      createdAt: new Date("2026-04-26T10:10:00"),
    },
    {
      action: "SCORE_SUBMITTED",
      actor: "Mariam Al Hosani",
      actorRole: "Technical Lead",
      summary: "Scores submitted for 5 bids across 4 criteria.",
      createdAt: new Date("2026-05-05T17:22:00"),
    },
    {
      action: "CLARIFICATION_ANSWERED",
      actor: "Cloudify Systems",
      actorRole: "Vendor",
      target: "Clause 3.1",
      summary: "Vendor revised liability cap from 5% → 25% with IP/confidentiality carve-outs.",
      createdAt: new Date("2026-05-04T11:35:00"),
    },
    {
      action: "AWARD_RECOMMENDED",
      actor: "Arjun Sharma",
      actorRole: "Procurement Manager",
      target: "TechNova Solutions",
      summary: "Award recommendation submitted for committee approval (USD 2,100,000).",
      createdAt: new Date("2026-05-10T09:00:00"),
    },
  ];
  for (const e of audit) {
    await prisma.auditEntry.create({
      data: {
        tenderId: tender.id,
        actor: e.actor,
        actorRole: e.actorRole,
        action: e.action,
        target: e.target,
        summary: e.summary,
        createdAt: e.createdAt,
      },
    });
  }

  // ── Supporting tenders ────────────────────────────────────────────────────
  const supporting: Prisma.TenderCreateInput[] = [
    {
      name: "Cloud Security Services",
      reference: "RFP-2034-16 (Round 1)",
      category: "IT — Cyber",
      client: "Acme Corporation",
      stage: "IN_EVALUATION",
      budget: 850_000,
      currency: "USD",
      issuedAt: new Date("2026-04-02"),
      closingAt: new Date("2026-05-15"),
      ownerName: "Mariam Al Hosani",
      weightTechnical: 50,
      weightCommercial: 30,
      weightDelivery: 15,
      weightLocalContent: 5,
    },
    {
      name: "Office Renovation Project",
      reference: "RFP-2034-14 (Round 2)",
      category: "Construction",
      client: "Acme Corporation",
      stage: "CLARIFICATIONS",
      budget: 3_400_000,
      currency: "USD",
      issuedAt: new Date("2026-02-18"),
      closingAt: new Date("2026-05-04"),
      ownerName: "Fahad Al Mansouri",
    },
    {
      name: "Annual Catering Services",
      reference: "RFP-2034-09",
      category: "Facilities",
      client: "Acme Corporation",
      stage: "AWARD_RECOMMENDED",
      budget: 480_000,
      currency: "USD",
      issuedAt: new Date("2026-01-12"),
      closingAt: new Date("2026-03-20"),
      ownerName: "Arjun Sharma",
    },
    {
      name: "Pan-GCC Logistics Partner",
      reference: "RFP-2034-22",
      category: "Logistics",
      client: "Acme Corporation",
      stage: "OPEN_FOR_BIDS",
      budget: 1_200_000,
      currency: "USD",
      issuedAt: new Date("2026-05-02"),
      closingAt: new Date("2026-06-15"),
      ownerName: "Daniel Roberts",
    },
    {
      name: "ERP Implementation",
      reference: "RFP-2034-20",
      category: "IT",
      client: "Acme Corporation",
      stage: "SCHEMA_REVIEW",
      budget: 4_800_000,
      currency: "USD",
      issuedAt: new Date("2026-04-28"),
      closingAt: new Date("2026-06-30"),
      ownerName: "Priya Iyer",
    },
    {
      name: "Network Hardware Refresh",
      reference: "RFP-2034-11",
      category: "IT",
      client: "Acme Corporation",
      stage: "AWARDED",
      budget: 720_000,
      currency: "USD",
      issuedAt: new Date("2026-01-08"),
      closingAt: new Date("2026-02-20"),
      ownerName: "Mariam Al Hosani",
    },
    {
      name: "Branch Security Audit",
      reference: "RFP-2034-25",
      category: "Cyber",
      client: "Acme Corporation",
      stage: "DRAFT",
      budget: 220_000,
      currency: "USD",
      issuedAt: new Date("2026-05-09"),
      closingAt: new Date("2026-06-25"),
      ownerName: "Daniel Roberts",
    },
  ];
  for (const t of supporting) await prisma.tender.create({ data: t });

  console.log("◆ Seed complete: 1 hero tender, 7 supporting tenders, 5 bids, 6 risks, 4 clarifications, 11 audit entries.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
