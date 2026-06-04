import { Nav } from "@/components/nav";
import { SubscribeForm } from "@/components/subscribe-form";
import { getSupabase } from "@/lib/supabase";
import { getWeekGroups } from "@/data/articles";
import Link from "next/link";
import { ArrowRight, Clock, ExternalLink } from "lucide-react";
import type { Digest, ArticleSummary } from "@/types/digest";

export const revalidate = 60;

async function getAllDigests(): Promise<Digest[]> {
  // Convert static articles to Digest shape
  const staticDigests: Digest[] = getWeekGroups().map((wg) => ({
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
  }));

  // Live digests from Supabase
  let liveDigests: Digest[] = [];
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("digests")
      .select("*")
      .order("year", { ascending: false })
      .order("week", { ascending: false })
      .limit(20);
    liveDigests = data ?? [];
  } catch {}

  // Live takes priority over static for same week
  const liveKeys = new Set(liveDigests.map((d) => `${d.year}-${d.week}`));
  const merged = [
    ...liveDigests,
    ...staticDigests.filter((d) => !liveKeys.has(`${d.year}-${d.week}`)),
  ].sort((a, b) => b.year !== a.year ? b.year - a.year : b.week - a.week);

  return merged;
}

async function getSubscriberCount(): Promise<number> {
  try {
    const supabase = getSupabase();
    const { count } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("active", true);
    return count ?? 0;
  } catch {
    return 0;
  }
}

function weekLabel(week: number, year: number): string {
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}, ${year}`;
}

const RANK_LABELS = ["Top Pick", "Also Great", "Worth Reading"];

function ArticleItem({ article, index, featured = false }: { article: ArticleSummary; index: number; featured?: boolean }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-2xl border bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        featured ? "border-stone-800" : "border-stone-200 hover:border-stone-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            index === 0 ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}>
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black ${
              index === 0 ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
            }`}>
              {index + 1}
            </span>
            {RANK_LABELS[index]}
          </span>
          <span className="text-xs font-medium text-stone-400">{article.source}</span>
          {article.readTime && (
            <span className="flex items-center gap-1 text-xs text-stone-300">
              <Clock size={10} /> {article.readTime}
            </span>
          )}
        </div>
        <ExternalLink size={13} className="shrink-0 text-stone-300 group-hover:text-stone-500 transition-colors mt-0.5" />
      </div>

      <h3 className={`font-bold text-stone-900 leading-snug mb-2 ${featured ? "text-xl" : "text-base"}`}>
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
            <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full border border-stone-150">
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

function subscriberProof(count: number): string {
  if (count >= 100) return `Join ${count.toLocaleString()} readers`;
  if (count > 0) return `Join ${count} readers who value their time`;
  return "Trusted by readers who value their time";
}

export default async function Home() {
  const [digests, subscriberCount] = await Promise.all([
    getAllDigests(),
    getSubscriberCount(),
  ]);
  const current = digests[0];
  const past = digests.slice(1, 5);

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main className="mx-auto max-w-2xl px-4">

        {/* Hero */}
        <header className="relative pt-20 pb-16 sm:pt-28 sm:pb-20">
          {/* Decorative gradient background */}
          <div className="hero-gradient absolute inset-0 -z-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-12 -left-20 w-72 h-72 bg-stone-200/30 rounded-full blur-3xl -z-10 pointer-events-none" aria-hidden="true" />

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-stone-900 leading-[1.05] mb-6">
            Three links.<br />Every week.<br />No noise.
          </h1>
          <p className="text-stone-500 text-lg sm:text-xl max-w-md leading-relaxed mb-4">
            AI-curated reading digests that respect your time. Just three articles, thoughtfully summarized.
          </p>

          {/* Social proof */}
          <p className="text-sm font-medium text-stone-400 mb-8">
            {subscriberProof(subscriberCount)}
          </p>

          <div id="subscribe" className="max-w-md">
            <SubscribeForm />
          </div>
        </header>

        {/* Manifesto / philosophy quote */}
        <section className="mb-20">
          <blockquote className="relative rounded-2xl border border-stone-200 bg-white px-8 py-10 sm:px-10 sm:py-12">
            <div className="absolute -top-4 left-8 bg-stone-50 px-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">The philosophy</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900 leading-snug tracking-tight">
              Three links. Curated by AI.<br />
              Delivered every Monday.<br />
              That&apos;s it.
            </p>
          </blockquote>
        </section>

        {/* Why Bookmark? */}
        <section className="mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">
            Why Bookmark?
          </h2>
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-6 sm:px-8 sm:py-8">
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-prose">
              Most newsletters overwhelm you. Bookmark gives you exactly three articles,
              thoughtfully summarized by AI, every Monday morning. Read the best, skip the rest.
            </p>
          </div>
        </section>

        {/* Visual preview card — newsletter-style */}
        <section className="mb-20">
          <div className="rounded-xl border border-stone-200 bg-white shadow-lg shadow-stone-200/50 overflow-hidden">
            {/* Email-style header */}
            <div className="px-6 pt-6 pb-4 border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
                  <span className="text-white text-xs font-black">B</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Bookmark Weekly</p>
                  <p className="text-[11px] text-stone-400">Every Monday morning</p>
                </div>
              </div>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
                What you get
              </p>
            </div>

            {/* Article previews */}
            <div className="divide-y divide-stone-100">
              {(current ? current.articles.slice(0, 3) : []).map((article, i) => (
                <div key={i} className="px-6 py-4 flex gap-4 items-start">
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mt-0.5 ${
                    i === 0
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        i === 0 ? "text-stone-900" : "text-stone-400"
                      }`}>
                        {RANK_LABELS[i]}
                      </span>
                      <span className="text-[10px] text-stone-300">{article.source}</span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900 leading-snug mb-1">{article.title}</p>
                    <p className="text-xs text-stone-400 line-clamp-1">{article.summary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <p className="text-xs text-stone-400 font-medium">
                3 articles &middot; curated by AI
              </p>
              <p className="text-xs text-stone-400">
                Read more &rarr;
              </p>
            </div>
          </div>
        </section>

        {/* Latest Digest */}
        {current ? (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  Latest Digest
                </h2>
                <p className="text-sm text-stone-400 mt-1">{weekLabel(current.week, current.year)}</p>
              </div>
              <Link
                href={`/archive/${current.year}/${current.week}`}
                className="flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors"
              >
                View full <ArrowRight size={11} />
              </Link>
            </div>

            {/* Digest title + intro */}
            {current.title && (
              <div className="mb-6 rounded-2xl bg-white border border-stone-200 px-6 py-5">
                <h3 className="font-bold text-stone-900 text-lg leading-snug mb-2">{current.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed max-w-prose">{current.intro}</p>
              </div>
            )}

            <div className="space-y-4">
              {current.articles.map((article, i) => (
                <ArticleItem key={i} article={article} index={i} featured={i === 0} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-20 rounded-2xl border border-dashed border-stone-200 py-16 text-center">
            <p className="text-stone-400 mb-3">No digest published yet.</p>
            <Link href="/create" className="text-sm font-medium text-stone-900 underline underline-offset-2">
              Create the first one &rarr;
            </Link>
          </section>
        )}

        {/* From the Archive */}
        {past.length > 0 && (
          <section className="pb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                From the Archive
              </h2>
              <Link href="/archive" className="flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-8">
              {past.map((digest) => (
                <div key={`${digest.year}-${digest.week}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">
                      {weekLabel(digest.week, digest.year)}
                    </span>
                    <div className="flex-1 h-px bg-stone-200" />
                  </div>
                  {digest.articles[0] && (
                    <ArticleItem article={digest.articles[0]} index={0} />
                  )}
                  <Link
                    href={`/archive/${digest.year}/${digest.week}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    All 3 picks from this week <ArrowRight size={11} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="pb-20">
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
            <h3 className="text-xl font-black text-stone-900 mb-2">
              Get three links like these every Monday
            </h3>
            <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto leading-relaxed">
              No spam, no noise — just the reads worth your time.
            </p>
            <div className="max-w-sm mx-auto">
              <SubscribeForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
