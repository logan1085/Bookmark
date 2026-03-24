import { Badge } from "@/components/ui/badge";
import type { Article } from "@/data/articles";
import { ExternalLink, Clock } from "lucide-react";

const RANK_LABELS = { 1: "Top Pick", 2: "Also Great", 3: "Worth Reading" };

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md ${
        featured ? "border-stone-900" : "border-stone-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${
              article.rank === 1
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            {RANK_LABELS[article.rank]}
          </span>
          <span className="text-xs text-stone-400">{article.source}</span>
        </div>
        <div className="flex items-center gap-1 text-stone-300 group-hover:text-stone-600 transition-colors shrink-0">
          <ExternalLink size={14} />
        </div>
      </div>

      <h3
        className={`font-bold text-stone-900 leading-snug mb-2 ${
          featured ? "text-xl" : "text-lg"
        }`}
      >
        {article.title}
      </h3>

      <p className="text-sm text-stone-500 leading-relaxed mb-4">
        {article.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] font-normal bg-stone-100 text-stone-400 uppercase tracking-wide"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-400 shrink-0 ml-2">
          <Clock size={11} />
          {article.readTime}
        </div>
      </div>
    </a>
  );
}
