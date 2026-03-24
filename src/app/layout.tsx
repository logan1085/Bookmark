import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookmark — 3 Articles Worth Your Time, Every Week",
  description: "A weekly reading list. Three articles, hand-picked, every week. No noise.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} antialiased`}>
        <body className="min-h-screen bg-stone-50 font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
