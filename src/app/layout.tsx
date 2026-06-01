import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookmark \u2014 Three Links. Every Week.",
  description:
    "AI-curated reading digests that respect your time. Subscribe for three thoughtfully summarized articles every week.",
  openGraph: {
    title: "Bookmark \u2014 Three Links. Every Week.",
    description:
      "AI-curated reading digests that respect your time. Subscribe for three thoughtfully summarized articles every week.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmark \u2014 Three Links. Every Week.",
    description:
      "AI-curated reading digests that respect your time. Subscribe for three thoughtfully summarized articles every week.",
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
              <p className="text-sm font-medium text-stone-400 tracking-tight">Built by Logan</p>
              <div className="flex items-center gap-5">
                <a
                  href="#"
                  className="text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors"
                >
                  X / Twitter
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
