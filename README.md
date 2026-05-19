# BidLens

**The tender evaluation app that replaces the Excel comparison matrix.**

> Drop the RFP and the vendor bids in. Get a structured side-by-side comparison,
> surfaced risks, gap analysis and a defensible award recommendation. Designed
> for procurement managers, tender committees, evaluators and approvers —
> not for lawyers.

Part of the **OnePlace / OneDataLens** ecosystem. Sister product:
[CV Intelligence Agent](https://github.com/santoshrnath/cvai).

---

## Why this exists

Tender evaluation is one of the highest-stakes, most-documented, worst-supported
workflows in any procurement function. Five common failures:

- The comparison matrix is an Excel nightmare (2–5 analyst-days per round).
- Vendor submissions are non-uniform (units, lump sums, bundling, currencies).
- Risky T&Cs hide in fine print (capped liability, aggressive advances,
  warranty carve-outs).
- Evaluation weighting drifts between draft and award. No audit trail.
- When losing bidders challenge an award, procurement teams cannot produce a
  defensible evaluation trail.

BidLens fixes the part incumbents have ignored — the **evaluation** —
without trying to be an e-Procurement platform or a CLM.

---

## What this POC shows

A working end-to-end product across the procurement workflow:

| Screen | What it does |
|---|---|
| **Dashboard** | Cinematic hero with live stats, active tenders and an audit-grade activity feed. |
| **Tenders → Detail → Overview** | Schema preview, mandatory T&Cs, committee, recommended-vendor card. |
| **Tenders → Detail → Comparison** | The hero screen. Side-by-side matrix with normalised pricing, sticky vendor headers, AI-surfaced clause comparison and a right-rail clause inspector. |
| **Tenders → Detail → Scores** | Per-criterion score rings + consolidated panel scores, ranked. |
| **Tenders → Detail → Risks** | Risk heatmap, then a full risk register with vendor position vs schema requirement. |
| **Tenders → Detail → Clarifications** | Threaded clarification rounds with diff-on-response. *Draft with Claude* generates new clarification questions on demand. |
| **Tenders → Detail → Audit Trail** | Defensibility pack — hash-chained, exportable. |
| **Vendors / Clauses / Templates / Reports / Team / Settings** | Library + ops surfaces. |

The hero tender (*Enterprise Data Center Migration*) is fully populated with
five bids, a richly-flagged risk register, two clarification rounds and a
real audit trail — so the partner walkthrough never lands on an empty state.

---

## Tech stack

**Frontend:** Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion
· Lucide icons. Light theme with deep-violet accent, soft shadows and subtle
spring animations throughout — designed mobile-first, expanding on desktop.

**Backend:** Next.js Route Handlers · Prisma ORM · Postgres 17 · Anthropic SDK.

**AI:** Claude Sonnet 4.6, with a graceful mock fallback so the demo never
breaks when an API key isn't set. Clarification drafting is wired today;
schema extraction and risk surfacing slot into the same pattern.

**Deployment:** Docker Compose. Same `git + scp .env + docker compose up`
pattern as the rest of the OnePlace ecosystem.

---

## Run it locally

```bash
git clone https://github.com/santoshrnath/bidlens.git
cd bidlens

# 1. Configure
cp .env.example .env.local
# Optionally set ANTHROPIC_API_KEY to light up Claude-backed flows.

# 2. Spin up Postgres + the app
docker compose up -d --build

# 3. Apply the Prisma schema + seed demo data
docker compose exec bidlens-app npx prisma db push
docker compose exec bidlens-app node node_modules/.bin/tsx prisma/seed.ts

# 4. Open
open http://localhost:3080
```

### Pure-Node dev (no Docker)

```bash
npm install
npm run prisma:generate
# DATABASE_URL must point to a reachable Postgres.
npm run prisma:push
npm run seed
npm run dev
```

---

## Deploy to Hetzner

Same pattern as [cvai](https://github.com/santoshrnath/cvai):

```bash
BIDLENS_SSH_HOST=root@<your-hetzner-ip> ./deploy/hetzner/deploy.sh
```

The script:

1. `git clone` (or `git fetch + reset --hard`) the repo to `/opt/bidlens` on the server.
2. `scp` your local `.env.local` to the server as `.env`.
3. `docker compose up -d --build`.
4. `prisma db push` to apply the schema.
5. Seed the demo dataset (set `BIDLENS_SEED=0` to skip).

Traefik labels target `bidlens.oneplaceplatform.com` by default (override via
`PUBLIC_HOSTNAME` in `.env`).

---

## Defensibility — by design

- **No AI auto-decisions.** Claude surfaces evidence and risks; humans
  evaluate and decide.
- **Every extraction is editable and traceable** to a source quote with
  page reference.
- **Immutable audit trail** — schema versions, score submissions,
  clarification rounds and award approvals are all timestamped,
  user-attributed and hash-chained.
- **Role-based access** — procurement lead, evaluator, approver, observer.
- **Confidentiality of bids** — vendor materials visible only to authorised
  evaluators; exports are watermarked.
- **Data residency configurable** per customer (UAE / KSA / EU / India).
- **Regulatory alignment** — UAE Federal Procurement Law and Abu Dhabi
  Procurement Standards; KSA Government Tenders and Procurement Law (GTPL);
  EU Public Procurement Directive.

---

## What's intentionally not built yet

This POC is the most demoable surface for partner sign-off. Deferred for v1:

- Real RFP/PDF parsing pipeline (the schema is generated from the seeded
  dataset; the Claude-backed extraction job is the next route to wire).
- Vendor portal — bid upload from the vendor side.
- Multi-tenant authentication (`tenantId` is on every row; auth wires in over it).
- E-tendering platform integrations (Tejari, Etimad).

---

## License

Apache-2.0.

---

Built by Santosh Raghunath as part of the
[OnePlace / OneDataLens](https://oneplaceplatform.com) ecosystem.
