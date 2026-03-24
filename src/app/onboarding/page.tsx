"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Check } from "lucide-react";

const TOPICS = [
  { id: "ai", label: "AI & Machine Learning", emoji: "🤖" },
  { id: "startups", label: "Startups & Venture", emoji: "🚀" },
  { id: "product", label: "Product & Design", emoji: "✦" },
  { id: "tech", label: "Tech & Infrastructure", emoji: "⚙️" },
  { id: "fintech", label: "Fintech & Crypto", emoji: "💳" },
  { id: "science", label: "Science & Deep Tech", emoji: "🧬" },
  { id: "strategy", label: "Strategy & Business", emoji: "♟️" },
  { id: "society", label: "AI & Society", emoji: "🌐" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleFinish() {
    // In a real app: save preferences to DB, subscribe to email list
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-stone-900" : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">
              What are you into?
            </h1>
            <p className="text-stone-500 mb-8">
              Pick the topics you care about. We&apos;ll make sure the weekly picks are relevant.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggle(topic.id)}
                  className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all ${
                    selected.has(topic.id)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  <span className="text-lg">{topic.emoji}</span>
                  <span className="text-sm font-medium leading-tight">{topic.label}</span>
                  {selected.has(topic.id) && (
                    <Check size={14} className="ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={selected.size === 0}
              className="w-full bg-stone-900 text-white py-3 rounded-full font-medium hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">
              Get it in your inbox?
            </h1>
            <p className="text-stone-500 mb-8">
              Every Monday, your 3 picks land in your inbox. No other emails. Ever.
            </p>
            <input
              type="email"
              placeholder={user?.primaryEmailAddress?.emailAddress ?? "your@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 mb-3"
            />
            <button
              onClick={handleFinish}
              className="w-full bg-stone-900 text-white py-3 rounded-full font-medium hover:bg-stone-700 transition-colors mb-3"
            >
              Subscribe & go to my feed
            </button>
            <button
              onClick={handleFinish}
              className="w-full text-sm text-stone-400 hover:text-stone-700 transition-colors py-2"
            >
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
