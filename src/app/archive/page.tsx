import { Nav } from "@/components/nav";
import { getWeekGroups } from "@/data/articles";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ArchivePage() {
  const weeks = getWeekGroups();

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
      <main className="mx-auto max-w-2xl px-4 py-12">
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Archive
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Every week, going back.
          </h1>
          <p className="mt-2 text-stone-500">
            {weeks.length} weeks · {weeks.length * 3} articles curated
          </p>
        </header>

        {years.map((year) => (
          <section key={year} className="mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-3 mb-6">
              {year}
            </h2>
            <div className="space-y-4">
              {byYear[year].map((week) => (
                <Link
                  key={`${week.year}-${week.week}`}
                  href={`/archive/${week.year}/${week.week}`}
                  className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 hover:border-stone-400 hover:shadow-sm transition-all"
                >
                  <div>
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
                      Week {week.week}
                    </p>
                    <p className="text-sm font-semibold text-stone-900">{week.label}</p>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                      {week.articles.map((a) => a.title).join(" · ")}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-stone-300 group-hover:text-stone-600 transition-colors shrink-0 ml-4"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
