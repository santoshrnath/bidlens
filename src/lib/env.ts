// Centralised env access. Reads at runtime so values can change between
// deploys without recompiling. Server-side only.

function get(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

function required(name: string): string {
  const v = get(name);
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  anthropic: {
    apiKey: () => get("ANTHROPIC_API_KEY"),
    apiKeyRequired: () => required("ANTHROPIC_API_KEY"),
    model: () => get("ANTHROPIC_MODEL") ?? "claude-sonnet-4-6",
  },
  db: {
    url: () => required("DATABASE_URL"),
  },
  app: {
    publicUrl: () =>
      get("PUBLIC_URL") ??
      `https://${get("PUBLIC_HOSTNAME") ?? "bidlens.oneplaceplatform.com"}`,
  },
  clerk: {
    publishableKey: () => get("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
    enabled: () =>
      !!get("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") && !!get("CLERK_SECRET_KEY"),
  },
};

export function aiEnabled(): boolean {
  return !!env.anthropic.apiKey();
}
