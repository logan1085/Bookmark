"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Nav } from "@/components/nav";
import type { Digest, GenerateEvent, ArticleSummary } from "@/types/digest";
import { CheckCircle, Circle, Loader, Send, Eye } from "lucide-react";

type Step =
  | { status: "idle" }
  | { status: "running" }
  | { status: "done"; digest: Omit<Digest, "id"> }
  | { status: "publishing" }
  | { status: "published"; subscriberCount: number };

type ArticleInput = {
  url: string;
  pasteText: string; // for X/Twitter URLs
};

const ADMIN_EMAIL = "LoganHorowitz2@gmail.com";

function isXUrl(url: string) {
  return /^https?:\/\/(www\.)?(twitter|x)\.com/.test(url);
}

export default function CreatePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [inputs, setInputs] = useState<ArticleInput[]>([
    { url: "", pasteText: "" },
    { url: "", pasteText: "" },
    { url: "", pasteText: "" },
  ]);
  const [step, setStep] = useState<Step>({ status: "idle" });
  const [events, setEvents] = useState<GenerateEvent[]>([]);
  const [digest, setDigest] = useState<Omit<Digest, "id"> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function setUrl(i: number, val: string) {
    setInputs((prev) =>
      prev.map((inp, idx) => (idx === i ? { ...inp, url: val, pasteText: "" } : inp))
    );
  }

  function setPasteText(i: number, val: string) {
    setInputs((prev) =>
      prev.map((inp, idx) => (idx === i ? { ...inp, pasteText: val } : inp))
    );
  }

  const canGenerate = inputs.every((inp) => {
    if (!inp.url.trim()) return false;
    if (isXUrl(inp.url) && !inp.pasteText.trim()) return false;
    return true;
  });

  async function generate() {
    if (!canGenerate) return;
    setStep({ status: "running" });
    setEvents([]);
    setDigest(null);
    setErrorMsg(null);

    const payload = inputs.map((inp) => ({
      url: inp.url,
      text: isXUrl(inp.url) ? inp.pasteText : undefined,
    }));

    console.log("[bookmark] starting generate", payload);

    let res: Response;
    try {
      res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: payload }),
      });
    } catch (err) {
      const msg = `Network error: ${err instanceof Error ? err.message : String(err)}`;
      console.error("[bookmark]", msg);
      setErrorMsg(msg);
      setStep({ status: "idle" });
      return;
    }

    console.log("[bookmark] response status:", res.status);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const msg = `Server error ${res.status}: ${body || res.statusText}`;
      console.error("[bookmark]", msg);
      setErrorMsg(msg);
      setStep({ status: "idle" });
      return;
    }

    if (!res.body) {
      setErrorMsg("No response stream received");
      setStep({ status: "idle" });
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        console.log("[bookmark] stream chunk", { done, bytes: value?.length });
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const event: GenerateEvent = JSON.parse(line.slice(6));
          console.log("[bookmark] event", event);
          setEvents((prev) => [...prev, event]);

          if (event.type === "complete") {
            setDigest(event.digest);
            setStep({ status: "done", digest: event.digest });
          }
          if (event.type === "error") {
            setErrorMsg(event.message);
            setStep({ status: "idle" });
          }
        }
      }
    } catch (err) {
      const msg = `Stream error: ${err instanceof Error ? err.message : String(err)}`;
      console.error("[bookmark]", msg);
      setErrorMsg(msg);
      setStep({ status: "idle" });
    }
  }

  async function publish() {
    if (!digest) return;
    setStep({ status: "publishing" });
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(digest),
    });
    const data = await res.json();
    setStep({ status: "published", subscriberCount: data.subscriberCount });
  }

  const isAdmin =
    user?.emailAddresses?.some(
      (e) => e.emailAddress.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    ) ?? false;

  if (isLoaded && !user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">Sign in to access this page.</p>
      </div>
    );
  }
  if (isLoaded && !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">This page is for the curator only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Create
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            This week&apos;s digest
          </h1>
          <p className="mt-2 text-stone-500">
            Paste 3 URLs. Claude reads, summarizes, and writes your digest.
          </p>
        </header>

        {/* URL inputs */}
        {(step.status === "idle" || step.status === "running") && (
          <div className="space-y-4 mb-8">
            {inputs.map((inp, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-stone-300 w-5 shrink-0">{i + 1}</span>
                  <input
                    type="url"
                    value={inp.url}
                    onChange={(e) => setUrl(i, e.target.value)}
                    placeholder="https://..."
                    disabled={step.status === "running"}
                    className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:opacity-50"
                  />
                </div>
                {isXUrl(inp.url) && (
                  <div className="ml-8">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1.5">
                      𝕏 X/Twitter detected — paste the post text below
                    </div>
                    <textarea
                      value={inp.pasteText}
                      onChange={(e) => setPasteText(i, e.target.value)}
                      placeholder="Paste the tweet or thread text here..."
                      disabled={step.status === "running"}
                      rows={4}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:opacity-50 resize-none"
                    />
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={generate}
              disabled={!canGenerate || step.status === "running"}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3 rounded-full font-medium hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step.status === "running" ? (
                <><Loader size={16} className="animate-spin" /> Claude is reading...</>
              ) : (
                "Generate digest →"
              )}
            </button>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        {/* Progress log */}
        {events.length > 0 && (
          <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Agent log
            </p>
            {events.map((event, i) => (
              <ProgressLine key={i} event={event} />
            ))}
          </div>
        )}

        {/* Digest preview */}
        {digest && step.status !== "publishing" && step.status !== "published" && (
          <div className="space-y-6">
            <DigestPreview digest={digest} />
            <button
              onClick={publish}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3 rounded-full font-medium hover:bg-stone-700 transition-colors"
            >
              <Send size={16} /> Publish + email subscribers
            </button>
            <button
              onClick={() => { setStep({ status: "idle" }); setEvents([]); setDigest(null); setErrorMsg(null); }}
              className="w-full text-sm text-stone-400 hover:text-stone-700 transition-colors py-1"
            >
              Start over
            </button>
          </div>
        )}

        {step.status === "publishing" && (
          <div className="text-center py-16">
            <Loader size={32} className="animate-spin text-stone-400 mx-auto mb-4" />
            <p className="text-stone-500">Publishing and sending emails...</p>
          </div>
        )}

        {step.status === "published" && (
          <div className="text-center py-16 space-y-4">
            <CheckCircle size={40} className="text-emerald-500 mx-auto" />
            <div>
              <p className="text-xl font-bold text-stone-900">Published!</p>
              <p className="text-stone-500 mt-1">
                {step.subscriberCount > 0
                  ? `Emailed ${step.subscriberCount} subscriber${step.subscriberCount > 1 ? "s" : ""}`
                  : "No subscribers yet — share the link to get readers"}
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              <Eye size={14} /> View live digest
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function ProgressLine({ event }: { event: GenerateEvent }) {
  const shortUrl = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); }
    catch { return url; }
  };

  if (event.type === "fetching")
    return (
      <div className="flex items-center gap-3 text-sm">
        <Loader size={14} className="animate-spin text-stone-400 shrink-0" />
        <span className="text-stone-500">Fetching article {event.index + 1}: <span className="font-medium text-stone-700">{shortUrl(event.url)}</span></span>
      </div>
    );
  if (event.type === "summarizing")
    return (
      <div className="flex items-center gap-3 text-sm">
        <Loader size={14} className="animate-spin text-stone-400 shrink-0" />
        <span className="text-stone-500">Summarizing: <span className="font-medium text-stone-700">{shortUrl(event.url)}</span></span>
      </div>
    );
  if (event.type === "article_done")
    return (
      <div className="flex items-center gap-3 text-sm">
        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
        <span className="text-stone-700"><span className="font-medium">{event.article.title}</span><span className="text-stone-400"> · {event.article.source}</span></span>
      </div>
    );
  if (event.type === "writing_intro")
    return (
      <div className="flex items-center gap-3 text-sm">
        <Loader size={14} className="animate-spin text-stone-400 shrink-0" />
        <span className="text-stone-500">Writing the connecting intro...</span>
      </div>
    );
  if (event.type === "complete")
    return (
      <div className="flex items-center gap-3 text-sm">
        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
        <span className="font-medium text-stone-700">Digest ready</span>
      </div>
    );
  if (event.type === "error")
    return (
      <div className="flex items-center gap-3 text-sm">
        <Circle size={14} className="text-red-400 shrink-0" />
        <span className="text-red-500">{event.message}</span>
      </div>
    );
  return null;
}

function DigestPreview({ digest }: { digest: Omit<Digest, "id"> }) {
  const RANK_LABELS = ["Top Pick", "Also Great", "Worth Reading"];
  return (
    <div className="rounded-2xl border-2 border-stone-900 bg-white overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-stone-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Week {digest.week} · {digest.year}</p>
        <h2 className="text-xl font-bold text-stone-900 mb-2">{digest.title}</h2>
        <p className="text-sm text-stone-500 leading-relaxed">{digest.intro}</p>
      </div>
      <div className="divide-y divide-stone-100">
        {digest.articles.map((article, i) => (
          <div key={i} className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest bg-stone-900 text-white px-2 py-0.5 rounded-full">{RANK_LABELS[i]}</span>
              <span className="text-xs text-stone-400">{article.source}</span>
              <span className="text-xs text-stone-300">· {article.readTime}</span>
            </div>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-bold text-stone-900 hover:underline block mb-2">{article.title}</a>
            <p className="text-sm text-stone-500 leading-relaxed mb-2">{article.summary}</p>
            <p className="text-sm text-stone-400 italic border-l-2 border-stone-200 pl-3">{article.keyInsight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
