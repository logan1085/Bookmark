import { Nav } from "@/components/nav";
import { getWeekGroups } from "@/data/articles";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ArchivePage() {
  const weeks = getWeekGroups();
  const totalArticles = weeks.reduce((sum, w) => sum + w.articles.length, 0);

  // Group by year
  const byYear = weeks.reduce<Record<number, typeof weeks>>((acc, w) => {
    if (!acc[w.year]) acc[w.year] = [];
    acc[w.year].push(w);
    return acc;
  }, {});

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <header className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
            Archive
          </p>
          <h1 className="text-4xl font-black tracking-tight text-stone-900 leading-tight">
            Every week, going back.
          </h1>
          <p className="mt-3 text-stone-500 text-lg leading-relaxed">
            {weeks.length} weeks &middot; {totalArticles} articles curated
          </p>
        </header>

        {years.map((year, yearIdx) => (
          <section key={year} className="mb-14">
            {/* Year separator */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-black text-stone-900 tabular-nums">
                {year}
              </h2>
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs font-medium text-stone-400">
                {byYear[year].length} {byYear[year].length === 1 ? "week" : "weeks"}
              </span>
            </div>

            <div className="space-y-3">
              {byYear[year].map((week) => (
                <Link
                  key={`${week.year}-${week.week}`}
                  href={`/archive/${week.year}/${week.week}`}
                  className="archive-card group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 hover:border-stone-300 hover:shadow-md transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-[10px] font-black text-stone-500 shrink-0">
                        {week.week}
                      </span>
                      <span className="text-sm font-bold text-stone-900 truncate">
                        Week {week.week}
                      </span>
                      <span className="text-xs text-stone-300 shrink-0">&middot;</span>
                      <span className="text-xs text-stone-400 shrink-0">
                        {week.articles.length} articles
                      </span>
                    </div>
                    <p className="text-sm font-medium text-stone-500 pl-8.5 mb-1">{week.label}</p>
                    <p className="text-xs text-stone-400 pl-8.5 line-clamp-1">
                      {week.articles.map((a) => a.title).join(" \u00b7 ")}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-stone-300 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-4"
                  />
                </Link>
              ))}
            </div>

            {/* Subtle divider between years (not after last) */}
            {yearIdx < years.length - 1 && (
              <div className="mt-14" />
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
