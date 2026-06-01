import { Nav } from "@/components/nav";
import { SubscribeForm } from "@/components/subscribe-form";
import { getWeekGroups } from "@/data/articles";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from "lucide-react";
import { ShareButtons } from "./share-buttons";
import type { Digest, ArticleSummary } from "@/types/digest";

const RANK_LABELS = ["Top Pick", "Also Great", "Worth Reading"];

async function getDigestForWeek(yearNum: number, weekNum: number): Promise<Digest | null> {
  // Try Supabase first
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("digests")
      .select("*")
      .eq("year", yearNum)
      .eq("week", weekNum)
      .single();
    if (data) return data;
  } catch {}

  // Fall back to static data
  const all = getWeekGroups();
  const wg = all.find((w) => w.year === yearNum && w.week === weekNum);
  if (!wg) return null;

  return {
    week: wg.week,
    year: wg.year,
    title: "",
    intro: "",
    articles: wg.articles.map((a) => ({
      url: a.url,
      title: a.title,
      source: a.source,
      summary: a.description,
      keyInsight: a.description,
      tags: a.tags,
      readTime: a.readTime,
    })),
  };
}

function DigestArticle({ article, index }: { article: ArticleSummary; index: number }) {
  const featured = index === 0;
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-2xl border bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        featured ? "border-stone-800" : "border-stone-200 hover:border-stone-300"
      }`}
    >
      {/* Number badge + content */}
      <div className="flex gap-0">
        {/* Prominent numbered badge strip */}
        <div className={`flex flex-col items-center justify-start pt-6 px-4 sm:px-5 shrink-0 ${
          featured ? "text-stone-900" : "text-stone-300"
        }`}>
          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${
            index === 0
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-500 border border-stone-200"
          }`}>
            {index + 1}
          </span>
        </div>

        {/* Article content */}
        <div className="flex-1 py-6 pr-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  index === 0 ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                {RANK_LABELS[index]}
              </span>
              <span className="text-xs font-medium text-stone-400">{article.source}</span>
              {article.readTime && (
                <span className="flex items-center gap-1 text-xs text-stone-300">
                  <Clock size={10} /> {article.readTime}
                </span>
              )}
            </div>
            <ExternalLink
              size={13}
              className="shrink-0 text-stone-300 group-hover:text-stone-500 transition-colors mt-0.5"
            />
          </div>

          <h3
            className={`font-bold text-stone-900 leading-snug mb-3 ${
              featured ? "text-xl" : "text-base"
            }`}
          >
            {article.title}
          </h3>

          <p className="text-sm text-stone-500 leading-relaxed mb-3 max-w-prose">{article.summary}</p>

          {article.keyInsight && article.keyInsight !== article.summary && (
            <div className="rounded-lg bg-amber-50/60 border border-amber-100 px-4 py-3 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70 mb-1">Key Insight</p>
              <p className="text-sm text-stone-600 leading-relaxed">
                {article.keyInsight}
              </p>
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold uppercase tracking-wide bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full border border-stone-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ year: string; week: string }>;
}) {
  const { year, week } = await params;
  const yearNum = Number(year);
  const weekNum = Number(week);

  const digest = await getDigestForWeek(yearNum, weekNum);
  if (!digest) notFound();

  // Find prev/next for navigation
  const allWeeks = getWeekGroups();
  const idx = allWeeks.findIndex(
    (w) => w.year === yearNum && w.week === weekNum
  );
  const newer = idx > 0 ? allWeeks[idx - 1] : null;
  const older = idx < allWeeks.length - 1 ? allWeeks[idx + 1] : null;

  const jan4 = new Date(yearNum, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (weekNum - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const dateLabel = `${fmt(monday)} – ${fmt(sunday)}, ${yearNum}`;

  const pageUrl = `/archive/${year}/${week}`;

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href="/archive"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to archive
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 text-white text-xs font-black">
              {weekNum}
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Week {weekNum} &middot; {yearNum}
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 mb-2 leading-tight">
            {digest.title || dateLabel}
          </h1>
          <p className="text-sm text-stone-400">{dateLabel} &middot; {digest.articles.length} articles</p>
        </header>

        {/* Digest intro */}
        {digest.intro && (
          <div className="mb-10 rounded-2xl bg-white border border-stone-200 px-6 py-5">
            <p className="text-sm text-stone-500 leading-relaxed max-w-prose">{digest.intro}</p>
          </div>
        )}

        {/* Articles */}
        <div className="space-y-5 mb-12">
          {digest.articles.map((article, i) => (
            <DigestArticle key={i} article={article} index={i} />
          ))}
        </div>

        {/* Share buttons */}
        <div className="mb-12">
          <ShareButtons pageUrl={pageUrl} />
        </div>

        {/* Subscribe CTA */}
        <div className="mb-14 rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
          <h3 className="text-xl font-black text-stone-900 mb-2">
            Subscribe for more
          </h3>
          <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto leading-relaxed">
            Three articles, every Monday. No spam, no noise -- just the reads worth your time.
          </p>
          <div className="max-w-sm mx-auto">
            <SubscribeForm />
          </div>
        </div>

        {/* Prev / next nav */}
        <div className="flex items-center justify-between border-t border-stone-200 pt-8">
          {older ? (
            <Link
              href={`/archive/${older.year}/${older.week}`}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft size={14} /> Older
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              href={`/archive/${newer.year}/${newer.week}`}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              Newer <ArrowRight size={14} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
