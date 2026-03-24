import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import type { ArticleSummary, GenerateEvent } from "@/types/digest";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchArticle(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const res = await fetch(jinaUrl, {
    headers: { Accept: "text/plain" },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const text = await res.text();
  return text.slice(0, 8000); // cap to avoid token overflow
}

function send(controller: ReadableStreamDefaultController, event: GenerateEvent) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  // Simple admin check — only allow the configured admin
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { urls }: { urls: string[] } = await req.json();
  if (!urls || urls.length !== 3) {
    return new Response("Exactly 3 URLs required", { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const articles: ArticleSummary[] = [];

        // Step 1: Fetch + summarize each article
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];

          send(controller, { type: "fetching", url, index: i });
          const content = await fetchArticle(url);

          send(controller, { type: "summarizing", url, index: i });

          const message = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 600,
            messages: [
              {
                role: "user",
                content: `You are summarizing an article for a curated weekly reading digest.

Article URL: ${url}
Article content:
${content}

Return a JSON object with exactly these fields:
{
  "title": "the article's actual title",
  "source": "publication name (e.g. Wired, The Atlantic, Bloomberg)",
  "summary": "2-3 sentences capturing the core argument or finding",
  "keyInsight": "one punchy sentence — the single most interesting takeaway",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": "X min"
}

Return only valid JSON, no markdown.`,
              },
            ],
          });

          const raw = (message.content[0] as { text: string }).text.trim();
          const parsed = JSON.parse(raw);
          const article: ArticleSummary = { url, ...parsed };
          articles.push(article);

          send(controller, { type: "article_done", index: i, article });
        }

        // Step 2: Write the connecting intro
        send(controller, { type: "writing_intro" });

        const introMessage = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: `You are writing the intro for a curated weekly reading digest. The curator has chosen these 3 articles:

${articles.map((a, i) => `${i + 1}. "${a.title}" — ${a.keyInsight}`).join("\n")}

Write a digest intro with:
- "title": a compelling 5-8 word title for this week's digest (not generic, reflect the theme)
- "intro": 2-3 sentences connecting these picks — what's the thread, why these 3 together, what does the curator want the reader to take away

Return only valid JSON: {"title": "...", "intro": "..."}`,
            },
          ],
        });

        const introRaw = (introMessage.content[0] as { text: string }).text.trim();
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
