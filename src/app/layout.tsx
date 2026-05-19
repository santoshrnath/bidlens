import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "BidLens — Tender evaluation, defensible.",
  description:
    "Replace the Excel comparison matrix. RFP-driven schema extraction, multi-bid normalisation, risk surfacing and a defensible audit trail — designed for procurement, not lawyers.",
  metadataBase: new URL(env.app.publicUrl()),
  openGraph: {
    title: "BidLens",
    description:
      "The tender evaluation app that replaces the Excel comparison matrix.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c5cff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7c5cff",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#0f172a",
          colorText: "#0f172a",
          colorTextSecondary: "#64748b",
          borderRadius: "0.85rem",
        },
        elements: {
          card: "shadow-[0_30px_80px_-20px_rgba(15,23,42,0.18)]",
          formButtonPrimary:
            "bg-violet-600 hover:bg-violet-700 shadow-[0_8px_24px_-12px_rgba(124,92,255,0.55)]",
        },
      }}
    >
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://rsms.me/" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </head>
        <body className="min-h-screen bg-page font-sans text-ink-900 antialiased">
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="relative flex min-h-screen flex-1 flex-col">
              <Topbar />
              <main className="relative flex-1 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
