import { Nav } from "@/components/nav";
import { SubscribeForm } from "@/components/subscribe-form";
import { getSupabase } from "@/lib/supabase";
import { getWeekGroups } from "@/data/articles";
import Link from "next/link";
import { ArrowRight, PenLine, Clock, ExternalLink } from "lucide-react";
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
      className={`group block rounded-2xl border bg-white p-6 transition-all hover:shadow-md ${
        featured ? "border-stone-800" : "border-stone-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            index === 0 ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}>
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

      <p className="text-sm text-stone-500 leading-relaxed mb-3">{article.summary}</p>

      {article.keyInsight && article.keyInsight !== article.summary && (
        <p className="text-sm text-stone-400 italic border-l-2 border-stone-100 pl-3 leading-relaxed">
          {article.keyInsight}
        </p>
      )}

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {article.tags.map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-wide bg-stone-50 text-stone-400 px-2 py-0.5 rounded-full border border-stone-100">
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

export default async function Home() {
  const digests = await getAllDigests();
  const current = digests[0];
  const past = digests.slice(1, 5);

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main className="mx-auto max-w-2xl px-4 py-12">

        {/* Hero */}
        <header className="mb-14">
          {current && (
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Week {current.week} · {current.year}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4 leading-[1.1]">
            Three articles.<br />Every week.<br />No noise.
          </h1>
          <p className="text-stone-500 text-base max-w-sm leading-relaxed mb-8">
            Hand-picked reads on AI, tech, and the ideas shaping what comes next. Summarized by Claude.
          </p>
          <SubscribeForm />
        </header>

        {/* This week */}
        {current ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  This Week
                </h2>
                <p className="text-sm text-stone-400 mt-0.5">{weekLabel(current.week, current.year)}</p>
              </div>
              <Link href="/create" className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors">
                <PenLine size={11} /> New digest
              </Link>
            </div>

            {/* Digest title + intro */}
            {current.title && (
              <div className="mb-5 rounded-2xl bg-white border border-stone-200 px-6 py-5">
                <h3 className="font-bold text-stone-900 text-lg leading-snug mb-2">{current.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{current.intro}</p>
              </div>
            )}

            <div className="space-y-4">
              {current.articles.map((article, i) => (
                <ArticleItem key={i} article={article} index={i} featured={i === 0} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-16 rounded-2xl border border-dashed border-stone-200 py-16 text-center">
            <p className="text-stone-400 mb-3">No digest published yet.</p>
            <Link href="/create" className="text-sm font-medium text-stone-900 underline underline-offset-2">
              Create the first one →
            </Link>
          </section>
        )}

        {/* Archive preview */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                From the Archive
              </h2>
              <Link href="/archive" className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-6">
              {past.map((digest) => (
                <div key={`${digest.year}-${digest.week}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                      {weekLabel(digest.week, digest.year)}
                    </span>
                    <div className="flex-1 h-px bg-stone-100" />
                  </div>
                  {digest.articles[0] && (
                    <ArticleItem article={digest.articles[0]} index={0} />
                  )}
                  <Link
                    href={`/archive/${digest.year}/${digest.week}`}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    All 3 picks from this week <ArrowRight size={11} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-stone-100 mt-20 py-8">
        <div className="mx-auto max-w-2xl px-4 text-center text-xs text-stone-400">
          Curated by Logan Horowitz &mdash;{" "}
          <a href="mailto:LoganHorowitz2@gmail.com" className="underline underline-offset-2 hover:text-stone-600">
            suggest an article
          </a>
        </div>
      </footer>
    </div>
  );
}
