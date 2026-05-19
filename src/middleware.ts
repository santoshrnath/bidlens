import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public surface — anyone can SEE the UI and the demo data. Cost-bearing
// endpoints (Claude calls, exports) enforce auth() inside the handler.
const isPublicRoute = createRouteMatcher([
  "/",
  "/tenders",
  "/tenders/(.*)",
  "/vendors",
  "/evaluations",
  "/clauses",
  "/templates",
  "/reports",
  "/team",
  "/settings",
  "/inbox",
  "/calendar",
  "/portal(.*)",
  "/api/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
