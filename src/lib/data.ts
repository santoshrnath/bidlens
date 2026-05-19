import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const [active, total, evaluations, clarifs, approvals, risks, recentActivity, tenders] =
    await Promise.all([
      prisma.tender.count({
        where: {
          stage: { in: ["OPEN_FOR_BIDS", "IN_EVALUATION", "CLARIFICATIONS", "SCHEMA_REVIEW"] },
        },
      }),
      prisma.tender.count(),
      prisma.score.groupBy({
        by: ["tenderId"],
        _count: { _all: true },
      }),
      prisma.clarificationItem.count({ where: { status: "open" } }),
      prisma.awardRecommendation.count({ where: { status: "submitted" } }),
      prisma.riskFlag.groupBy({
        by: ["severity"],
        _count: { _all: true },
      }),
      prisma.auditEntry.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { tender: { select: { name: true, id: true, reference: true } } },
      }),
      prisma.tender.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        include: {
          bids: { select: { id: true } },
          _count: { select: { bids: true, risks: true } },
        },
      }),
    ]);

  return { active, total, evaluations, clarifs, approvals, risks, recentActivity, tenders };
}

export async function listTenders() {
  return prisma.tender.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { bids: true, risks: true, clarifications: true } },
      bids: { select: { id: true, isRecommended: true, overallScore: true, vendorName: true, accentColor: true } },
    },
  });
}

export async function getTender(id: string) {
  return prisma.tender.findUnique({
    where: { id },
    include: {
      schema: true,
      committee: true,
      bids: {
        include: {
          risks: true,
          scores: true,
        },
        orderBy: { totalPrice: "asc" },
      },
      risks: true,
      clarifications: {
        include: {
          items: { include: { bid: true } },
        },
        orderBy: { number: "desc" },
      },
      audit: { orderBy: { createdAt: "desc" } },
      award: { include: { approvalSteps: { orderBy: { order: "asc" } } } },
    },
  });
}

export async function listVendors() {
  return prisma.vendor.findMany({ orderBy: { name: "asc" } });
}

export async function listClauses() {
  return prisma.clauseTemplate.findMany({ orderBy: { category: "asc" } });
}

export async function listTenderTemplates() {
  return prisma.tenderTemplate.findMany({ orderBy: { name: "asc" } });
}
