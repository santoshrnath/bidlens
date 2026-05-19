import type { Metadata, Viewport } from "next";
import "./globals.css";
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
  );
}
