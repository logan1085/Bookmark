import { Nav } from "@/components/nav";
import { SubscribeForm } from "@/components/subscribe-form";
import { getSupabase } from "@/lib/supabase";
import { getWeekGroups } from "@/data/articles";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import type { Digest } from "@/types/digest";

async function getAllDigests(): Promise<Digest[]> {
  // Static curated articles converted to Digest shape
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
      keyInsight: a.why,
      tags: a.tags,
      readTime: a.readTime,
    })),
  }));

  // Live Supabase digests
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

  // Merge: live takes priority over static for same week
  const liveKeys = new Set(liveDigests.map((d) => `${d.year}-${d.week}`));
  const filtered = staticDigests.filter((d) => !liveKeys.has(`${d.year}-${d.week}`));
  const merged = [...liveDigests, ...filtered].sort((a, b) =>
    b.year !== a.year ? b.year - a.year : b.week - a.week
  );
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

export const revalidate = 60;

export default async function Home() {
  const digests = await getAllDigests();
  const current = digests[0];
  const past = digests.slice(1, 4);

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main className="mx-auto max-w-2xl px-4 py-12">
        <header className="mb-14">
          {current && (
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Week {current.week} · {current.year}
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 mb-4 leading-tight">
            Three articles.<br />Every week.<br />No noise.
          </h1>
          <p className="text-stone-500 text-base max-w-sm leading-relaxed mb-6">
            Hand-picked reads on AI, technology, and the ideas shaping what comes next. Summarized by Claude.
          </p>
          <SubscribeForm />
        </header>

        {/* This week */}
        {current ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
                  This Week
                </h2>
                <p className="text-sm text-stone-500">{weekLabel(current.week, current.year)}</p>
              </div>
              <Link href="/create" className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-900 transition-colors">
                <PenLine size={12} /> New digest
              </Link>
            </div>

            {current.title && (
              <div className="mb-6 rounded-2xl bg-white border border-stone-200 px-6 py-5">
                <h3 className="font-bold text-stone-900 text-lg mb-2">{current.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{current.intro}</p>
              </div>
            )}

            <div className="space-y-4">
              {current.articles.map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md ${i === 0 ? "border-stone-900" : "border-stone-200"}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${i === 0 ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"}`}>
                        {["Top Pick", "Also Great", "Worth Reading"][i]}
                      </span>
                      <span className="text-xs text-stone-400">{article.source}</span>
                    </div>
                  </div>
                  <h3 className={`font-bold text-stone-900 leading-snug mb-2 ${i === 0 ? "text-xl" : "text-lg"}`}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-3">{article.summary}</p>
                  <p className="text-sm text-stone-400 italic border-l-2 border-stone-200 pl-3">
                    {article.keyInsight}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-16 text-center py-16 text-stone-400">
            <p>No digest published yet.</p>
            <Link href="/create" className="mt-3 inline-block text-sm text-stone-900 underline">
              Create the first one →
            </Link>
          </section>
        )}

        {/* Past weeks */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                From the Archive
              </h2>
              <Link href="/archive" className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-900 transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-8">
              {past.map((digest) => (
                <div key={`${digest.year}-${digest.week}`}>
                  <p className="text-xs font-medium text-stone-400 mb-3 uppercase tracking-wide">
                    {weekLabel(digest.week, digest.year)}
                  </p>
                  {digest.articles[0] && (
                    <a
                      href={digest.articles[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-2xl border border-stone-200 bg-white p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-widest bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">Top Pick</span>
                        <span className="text-xs text-stone-400">{digest.articles[0].source}</span>
                      </div>
                      <h3 className="font-bold text-stone-900 leading-snug mb-1">{digest.articles[0].title}</h3>
                      <p className="text-sm text-stone-500 line-clamp-2">{digest.articles[0].summary}</p>
                    </a>
                  )}
                  <Link
                    href={`/archive/${digest.year}/${digest.week}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    See all 3 from this week <ArrowRight size={11} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-stone-200 mt-16 py-8">
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
