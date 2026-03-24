import Anthropic from "@anthropic-ai/sdk";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import type { ArticleSummary, GenerateEvent } from "@/types/digest";

export const maxDuration = 60; // extend Vercel timeout to 60s

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function fetchArticle(url: string): Promise<string> {
  // Try Jina reader first
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await withTimeout(
      fetch(jinaUrl, { headers: { Accept: "text/plain" } }),
      20000
    );
    if (res.ok) {
      const text = await res.text();
      if (text.length > 200) return text.slice(0, 8000);
    }
  } catch (e) {
    console.error("Jina fetch failed:", e);
  }

  // Fallback: direct fetch
  try {
    const res = await withTimeout(
      fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }),
      10000
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 8000);
  } catch (e) {
    throw new Error(`Could not fetch article: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function send(controller: ReadableStreamDefaultController, event: GenerateEvent) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Admin-only
  const user = await currentUser();
  const isAdmin = user?.emailAddresses?.some(
    (e) => e.emailAddress.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()
  );
  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  const { urls }: { urls: string[] } = await req.json();
  if (!urls || urls.length !== 3) {
    return new Response("Exactly 3 URLs required", { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const articles: ArticleSummary[] = [];

        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];

          send(controller, { type: "fetching", url, index: i });

          let content: string;
          try {
            content = await fetchArticle(url);
          } catch (err) {
            send(controller, {
              type: "error",
              message: `Could not fetch article ${i + 1}: ${err instanceof Error ? err.message : "unknown error"}`,
            });
            controller.close();
            return;
          }

          send(controller, { type: "summarizing", url, index: i });

          const message = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 600,
            messages: [
              {
                role: "user",
                content: `Summarize this article for a curated weekly reading digest.

URL: ${url}
Content:
${content}

Return ONLY a valid JSON object with these exact fields:
{
  "title": "the article's actual title",
  "source": "publication name (e.g. Wired, The Atlantic, Bloomberg)",
  "summary": "2-3 sentences capturing the core argument",
  "keyInsight": "one punchy sentence — the single most interesting takeaway",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": "X min"
}`,
              },
            ],
          });

          const raw = (message.content[0] as { text: string }).text.trim()
            .replace(/^```json\n?/, "").replace(/\n?```$/, "");

          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            send(controller, { type: "error", message: `Failed to parse summary for article ${i + 1}` });
            controller.close();
            return;
          }

          const article: ArticleSummary = { url, ...parsed };
          articles.push(article);
          send(controller, { type: "article_done", index: i, article });
        }

        // Write connecting intro
        send(controller, { type: "writing_intro" });

        const introMessage = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: `Write the intro for a curated weekly reading digest with these 3 articles:

${articles.map((a, i) => `${i + 1}. "${a.title}" — ${a.keyInsight}`).join("\n")}

Return ONLY valid JSON: {"title": "5-8 word compelling title", "intro": "2-3 sentences connecting these picks and why they matter together"}`,
            },
          ],
        });

        const introRaw = (introMessage.content[0] as { text: string }).text.trim()
          .replace(/^```json\n?/, "").replace(/\n?```$/, "");
        const { title, intro } = JSON.parse(introRaw);

        const now = new Date();
        const week = getISOWeek(now);
        const year = now.getFullYear();

        send(controller, {
          type: "complete",
          digest: { week, year, title, intro, articles },
        });
      } catch (err) {
        send(controller, {
          type: "error",
          message: err instanceof Error ? err.message : "Something went wrong",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}
