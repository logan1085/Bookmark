import { Nav } from "@/components/nav";
import { ArticleCard } from "@/components/article-card";
import { getCurrentWeek, getWeekGroups } from "@/data/articles";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const currentWeek = getCurrentWeek();
  const allWeeks = getWeekGroups();
  const pastWeeks = allWeeks.slice(1, 4); // show 3 past weeks in preview

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main className="mx-auto max-w-2xl px-4 py-12">
        {/* Hero */}
        <header className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
            Week {currentWeek?.week} · {currentWeek?.year}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 mb-4 leading-tight">
            Three articles.<br />Every week.<br />No noise.
          </h1>
          <p className="text-stone-500 text-lg max-w-md mx-auto leading-relaxed">
            Hand-picked reads on AI, technology, and the ideas shaping what comes next.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors"
            >
              Get the weekly digest
            </Link>
            <Link
              href="/archive"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              Browse archive →
            </Link>
          </div>
        </header>

        {/* This week */}
        {currentWeek && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
                  This Week
                </h2>
                <p className="text-sm text-stone-500">{currentWeek.label}</p>
              </div>
            </div>
            <div className="space-y-4">
              {currentWeek.articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured={article.rank === 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past weeks preview */}
        {pastWeeks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                From the Archive
              </h2>
              <Link
                href="/archive"
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-8">
              {pastWeeks.map((week) => (
                <div key={`${week.year}-${week.week}`}>
                  <p className="text-xs font-medium text-stone-400 mb-3 uppercase tracking-wide">
                    {week.label}
                  </p>
                  <div className="space-y-3">
                    {week.articles.slice(0, 1).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                  <Link
                    href={`/archive/${week.year}/${week.week}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    See all 3 picks from this week <ArrowRight size={11} />
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
          <a
            href="mailto:LoganHorowitz2@gmail.com"
            className="underline underline-offset-2 hover:text-stone-600"
          >
            suggest an article
          </a>
        </div>
      </footer>
    </div>
  );
}

