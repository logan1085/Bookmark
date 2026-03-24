import { Nav } from "@/components/nav";
import { ArticleCard } from "@/components/article-card";
import { getWeekGroups } from "@/data/articles";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default async function WeekPage({
  params,
}: {
  params: Promise<{ year: string; week: string }>;
}) {
  const { year, week } = await params;
  const all = getWeekGroups();
  const idx = all.findIndex(
    (w) => w.year === Number(year) && w.week === Number(week)
  );
  if (idx === -1) notFound();

  const current = all[idx];
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href="/archive"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to archive
        </Link>

        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Week {current.week} · {current.year}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {current.label}
          </h1>
        </header>

        <div className="space-y-4 mb-12">
          {current.articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={article.rank === 1}
            />
          ))}
        </div>

        {/* Prev / next nav */}
        <div className="flex items-center justify-between border-t border-stone-200 pt-6">
          {older ? (
            <Link
              href={`/archive/${older.year}/${older.week}`}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft size={14} /> Older
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              href={`/archive/${newer.year}/${newer.week}`}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
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
