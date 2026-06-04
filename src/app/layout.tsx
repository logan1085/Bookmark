import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bookmark.supply"),
  title: "Bookmark — Three Links. Every Week.",
  description:
    "AI-curated reading digests that respect your time. Three articles, thoughtfully summarized, every Monday morning.",
  openGraph: {
    title: "Bookmark — Three Links. Every Week.",
    description:
      "AI-curated reading digests that respect your time. Three articles, thoughtfully summarized, every Monday morning.",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Bookmark — Three Links. Every Week." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmark — Three Links. Every Week.",
    description:
      "AI-curated reading digests that respect your time. Three articles, thoughtfully summarized, every Monday morning.",
    images: ["/api/og"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} antialiased`}>
        <body className="min-h-screen bg-stone-50 font-sans antialiased">
          {children}
          <footer className="border-t border-stone-200 bg-stone-100 py-10">
            <div className="mx-auto max-w-2xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-medium text-stone-400 tracking-tight">
                Built by Logan
              </p>
              <div className="flex items-center gap-5">
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Follow on X
                </a>
                <span className="text-stone-300">|</span>
                <a
                  href="#subscribe"
                  className="text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Subscribe
                </a>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
