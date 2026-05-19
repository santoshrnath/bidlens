# syntax=docker/dockerfile:1
# =============================================================================
# BidLens — production Dockerfile (Next.js)
# =============================================================================
# Single-stage-ish: build inside the image, then run `next start`. We keep
# the full node_modules so CLI tools (prisma, tsx) work for db push + seed.
# =============================================================================
FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates fontconfig openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development
ENV NPM_CONFIG_PRODUCTION=false
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund --ignore-scripts

COPY prisma ./prisma
RUN for i in 1 2 3 4 5 6; do \
      ./node_modules/.bin/prisma generate && break; \
      echo "prisma generate attempt $i failed — sleeping $((i * 5))s before retry"; \
      sleep $((i * 5)); \
    done

COPY . .

ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
