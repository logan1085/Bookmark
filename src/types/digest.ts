export type ArticleSummary = {
  url: string;
  title: string;
  source: string;
  summary: string;
  keyInsight: string;
  tags: string[];
  readTime: string;
};

export type Digest = {
  id?: string;
  week: number;
  year: number;
  title: string;
  intro: string;
  articles: ArticleSummary[];
  publishedAt?: string;
  createdAt?: string;
};

export type GenerateEvent =
  | { type: "fetching"; url: string; index: number }
  | { type: "summarizing"; url: string; index: number }
  | { type: "article_done"; index: number; article: ArticleSummary }
  | { type: "writing_intro" }
  | { type: "complete"; digest: Omit<Digest, "id"> }
  | { type: "error"; message: string };
