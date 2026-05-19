// Auth context + tenant resolution + super-admin check.
//
// Anonymous visitors read the "default" demo pool (read-only).
// Signed-in users get their Clerk userId as tenantId (writes scoped to them).
// Super admins (env list) READ across all tenants; writes go to their own.

import { auth, currentUser } from "@clerk/nextjs/server";

export const DEFAULT_TENANT = "default";

export interface AuthContext {
  userId: string | null;
  email: string | null;
  fullName: string | null;
  isSuperAdmin: boolean;
  tenantId: string;
  canSeeAllTenants: boolean;
}

function adminEmails(): string[] {
  const raw = process.env.SUPER_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAuthContext(): Promise<AuthContext> {
  let userId: string | null = null;
  try {
    const a = await auth();
    userId = a.userId ?? null;
  } catch {
    // auth() throws if Clerk isn't configured — treat as anonymous.
  }
  if (!userId) {
    return {
      userId: null,
      email: null,
      fullName: null,
      isSuperAdmin: false,
      tenantId: DEFAULT_TENANT,
      canSeeAllTenants: false,
    };
  }
  let email: string | null = null;
  let fullName: string | null = null;
  try {
    const u = await currentUser();
    email = u?.emailAddresses?.[0]?.emailAddress ?? null;
    fullName =
      [u?.firstName, u?.lastName].filter(Boolean).join(" ") || null;
  } catch {}
  const isSuperAdmin = !!email && adminEmails().includes(email.toLowerCase());
  return {
    userId,
    email,
    fullName,
    isSuperAdmin,
    tenantId: userId,
    canSeeAllTenants: isSuperAdmin,
  };
}

export function clerkEnabled(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !!process.env.CLERK_SECRET_KEY
  );
}
