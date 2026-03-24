export type Article = {
  id: string;
  title: string;
  url: string;
  source: string;
  description: string;
  week: number;
  year: number;
  rank: 1 | 2 | 3;
  tags: string[];
  readTime: string;
};

export type WeekGroup = {
  week: number;
  year: number;
  label: string;
  articles: Article[];
};

export const articles: Article[] = [
  // Week 12, 2026 (Mar 23–29)
  {
    id: "w12-26-1",
    title: "The Intelligence Explosion Is Already Here",
    url: "https://www.theatlantic.com/technology/archive/2025/01/anthropic-model-welfare/681156/",
    source: "The Atlantic",
    description: "AI capabilities are compounding faster than our institutions can adapt. What happens when the curve bends upward and doesn't stop?",
    week: 12, year: 2026, rank: 1,
    tags: ["AI", "Society"],
    readTime: "12 min",
  },
  {
    id: "w12-26-2",
    title: "DeepSeek's $6M Model Changed Everything We Thought We Knew",
    url: "https://www.wired.com/story/deepseek-r1-ai-benchmark/",
    source: "Wired",
    description: "The Chinese lab that upended the compute-cost assumptions every frontier lab was building on. The efficiency gap is closing faster than anyone predicted.",
    week: 12, year: 2026, rank: 2,
    tags: ["AI", "China", "Research"],
    readTime: "9 min",
  },
  {
    id: "w12-26-3",
    title: "Why Every Company Is Now a Software Company (Whether They Want to Be or Not)",
    url: "https://stratechery.com/2025/the-end-of-the-beginning/",
    source: "Stratechery",
    description: "Ben Thompson on the second-order effects of AI on organizational structure. The companies that don't adapt won't know why they're losing until it's too late.",
    week: 12, year: 2026, rank: 3,
    tags: ["Strategy", "AI", "Business"],
    readTime: "15 min",
  },

  // Week 11, 2026 (Mar 16–22)
  {
    id: "w11-26-1",
    title: "Cursor Crossed $500M ARR. Here's the Playbook",
    url: "https://www.bloomberg.com/news/articles/2025-03-01/cursor-ai-editor",
    source: "Bloomberg",
    description: "The AI code editor went from zero to half a billion in annual revenue in two years. A breakdown of how they won developers and why incumbents couldn't respond.",
    week: 11, year: 2026, rank: 1,
    tags: ["Dev Tools", "AI", "Startups"],
    readTime: "8 min",
  },
  {
    id: "w11-26-2",
    title: "The New Science of Building AI Agents That Actually Work",
    url: "https://www.oneusefulthing.org/p/on-the-nature-of-ai-agents",
    source: "One Useful Thing",
    description: "Ethan Mollick's framework for thinking about agentic AI — what makes agents reliable, where they break, and how to design workflows that don't fall apart.",
    week: 11, year: 2026, rank: 2,
    tags: ["AI Agents", "Research"],
    readTime: "11 min",
  },
  {
    id: "w11-26-3",
    title: "How Ramp Became the Finance Tool Every Fast Company Wants",
    url: "https://www.fastcompany.com/most-innovative-companies/2025",
    source: "Fast Company",
    description: "Ramp's path from corporate card to full finance automation suite. The unsexy category that ended up being exactly the right bet.",
    week: 11, year: 2026, rank: 3,
    tags: ["Fintech", "B2B", "Startups"],
    readTime: "7 min",
  },

  // Week 10, 2026 (Mar 9–15)
  {
    id: "w10-26-1",
    title: "Sam Altman's Letter on What Comes After ChatGPT",
    url: "https://openai.com/index/planning-for-agi-and-beyond/",
    source: "OpenAI Blog",
    description: "The CEO of OpenAI on superintelligence timelines, the responsibility of the lab that gets there first, and why the hardest part isn't the technology.",
    week: 10, year: 2026, rank: 1,
    tags: ["AI", "AGI", "OpenAI"],
    readTime: "10 min",
  },
  {
    id: "w10-26-2",
    title: "The Last Mile Problem in Healthcare AI",
    url: "https://www.statnews.com/2025/03/01/abridge-healthcare-ai/",
    source: "STAT News",
    description: "Abridge is saving physicians 90 minutes a day. The real story is what happens when the AI is right but the institution isn't ready to trust it.",
    week: 10, year: 2026, rank: 2,
    tags: ["Healthcare", "AI", "Startups"],
    readTime: "13 min",
  },
  {
    id: "w10-26-3",
    title: "Nvidia's Moat Is Not What You Think It Is",
    url: "https://www.semianalysis.com/p/nvidia-moat",
    source: "SemiAnalysis",
    description: "The hardware analysis everyone quotes but few have read. CUDA is the answer, but the real moat is something more mundane and more durable.",
    week: 10, year: 2026, rank: 3,
    tags: ["Hardware", "AI", "Infrastructure"],
    readTime: "18 min",
  },

  // Week 9, 2026 (Mar 2–8)
  {
    id: "w9-26-1",
    title: "The Case for Vertical AI: Why Horizontal Will Lose",
    url: "https://www.sequoiacap.com/article/ai-50-2025/",
    source: "Sequoia Capital",
    description: "The Forbes AI 50 thesis unpacked: the next wave of billion-dollar AI companies will be built for one industry, not for everyone.",
    week: 9, year: 2026, rank: 1,
    tags: ["AI", "VC", "Strategy"],
    readTime: "9 min",
  },
  {
    id: "w9-26-2",
    title: "What Business School Gets Wrong About Technology",
    url: "https://hbr.org/2025/01/why-mba-programs-are-finally-taking-ai-seriously",
    source: "Harvard Business Review",
    description: "The gap between what MBAs are taught and what the AI transition actually requires. A critique from inside the system.",
    week: 9, year: 2026, rank: 2,
    tags: ["Education", "AI", "Business"],
    readTime: "8 min",
  },
  {
    id: "w9-26-3",
    title: "Temporal Technologies and the Hidden Infrastructure Bet",
    url: "https://thenewstack.io/temporal-workflow-orchestration/",
    source: "The New Stack",
    description: "Why workflow orchestration is the unsexy infrastructure layer that every serious AI agent system eventually rediscovers. Temporal is the company quietly winning it.",
    week: 9, year: 2026, rank: 3,
    tags: ["Infrastructure", "AI Agents", "Dev Tools"],
    readTime: "10 min",
  },

  // Week 8, 2026 (Feb 23–Mar 1)
  {
    id: "w8-26-1",
    title: "The Product Manager Is Dead. Long Live the Product Manager.",
    url: "https://www.lennysnewsletter.com/p/the-future-of-product-management",
    source: "Lenny's Newsletter",
    description: "What happens to the PM role when AI can write specs, run user research, and ship code? The honest answer is more complicated than the hot takes suggest.",
    week: 8, year: 2026, rank: 1,
    tags: ["Product", "AI", "Careers"],
    readTime: "12 min",
  },
  {
    id: "w8-26-2",
    title: "SpaceX Starship's Fifth Launch Changed the Physics of Space Business",
    url: "https://arstechnica.com/space/2024/10/spacex-starship-flight-5/",
    source: "Ars Technica",
    description: "The caught booster was the headline. The real story is what reusability at this scale does to launch economics — and who it threatens.",
    week: 8, year: 2026, rank: 2,
    tags: ["SpaceX", "Aerospace", "Deep Tech"],
    readTime: "14 min",
  },
  {
    id: "w8-26-3",
    title: "How ElevenLabs Became the Voice of AI",
    url: "https://techcrunch.com/2025/01/23/elevenlabs-raises-180m/",
    source: "TechCrunch",
    description: "$90M ARR, 1M+ users, and the dominant API for realistic voice generation. The story of a team that moved faster than every well-funded incumbent.",
    week: 8, year: 2026, rank: 3,
    tags: ["AI", "Voice", "Startups"],
    readTime: "7 min",
  },

  // Week 4, 2026 (Jan 26–Feb 1)
  {
    id: "w4-26-1",
    title: "The Attention Economy Was Just the Beginning",
    url: "https://www.theatlantic.com/technology/archive/2024/11/the-end-of-the-attention-economy/680696/",
    source: "The Atlantic",
    description: "What comes after platforms competed for your time? They're now competing for your agency. The shift is subtle and the stakes are higher.",
    week: 4, year: 2026, rank: 1,
    tags: ["Tech", "Society", "AI"],
    readTime: "16 min",
  },
  {
    id: "w4-26-2",
    title: "Exa's Bet: The Web Needs a Neural Search Layer",
    url: "https://exa.ai/blog",
    source: "Exa Blog",
    description: "Why keyword search was always a workaround and what it looks like when retrieval is built natively for how AI systems actually think.",
    week: 4, year: 2026, rank: 2,
    tags: ["Search", "AI", "Infrastructure"],
    readTime: "8 min",
  },
  {
    id: "w4-26-3",
    title: "What I Learned Shipping 10 AI Products in 12 Months",
    url: "https://www.lennysnewsletter.com/p/building-ai-products",
    source: "Lenny's Newsletter",
    description: "The honest failures and surprising wins from a team that shipped more AI products in a year than most companies ship in a decade.",
    week: 4, year: 2026, rank: 3,
    tags: ["Product", "AI", "Startups"],
    readTime: "11 min",
  },

  // Week 1, 2026 (Jan 5–11) — Year kickoff
  {
    id: "w1-26-1",
    title: "2026 Will Be the Year AI Gets Boring (and That's Great)",
    url: "https://www.wired.com/story/2026-ai-predictions/",
    source: "Wired",
    description: "The hype cycle is peaking. What comes next is more interesting: AI that quietly becomes infrastructure. A look at what 'boring AI' actually means.",
    week: 1, year: 2026, rank: 1,
    tags: ["AI", "Predictions", "Tech"],
    readTime: "10 min",
  },
  {
    id: "w1-26-2",
    title: "The Jobs That AI Is Actually Replacing (It's Not What You Think)",
    url: "https://hbr.org/2025/11/which-jobs-will-ai-actually-replace",
    source: "Harvard Business Review",
    description: "New data on labor displacement shows a different picture than the narrative. The pattern is more specific, more gradual, and more recoverable than predicted.",
    week: 1, year: 2026, rank: 2,
    tags: ["AI", "Labor", "Economy"],
    readTime: "13 min",
  },
  {
    id: "w1-26-3",
    title: "The Case for Optimism About AI",
    url: "https://darioamodei.com/machines-of-loving-grace",
    source: "Dario Amodei",
    description: "Anthropic's CEO on a future where AI compresses decades of scientific progress into years. One of the most important things written about AI in 2025.",
    week: 1, year: 2026, rank: 3,
    tags: ["AI", "Future", "Society"],
    readTime: "45 min",
  },
];

export function getWeekGroups(): WeekGroup[] {
  const map = new Map<string, WeekGroup>();

  for (const article of articles) {
    const key = `${article.year}-${article.week}`;
    if (!map.has(key)) {
      map.set(key, {
        week: article.week,
        year: article.year,
        label: weekLabel(article.week, article.year),
        articles: [],
      });
    }
    map.get(key)!.articles.push(article);
  }

  return Array.from(map.values())
    .map((g) => ({ ...g, articles: g.articles.sort((a, b) => a.rank - b.rank) }))
    .sort((a, b) => b.year !== a.year ? b.year - a.year : b.week - a.week);
}

export function getCurrentWeek(): WeekGroup | undefined {
  return getWeekGroups()[0];
}

function weekLabel(week: number, year: number): string {
  // Get Monday of the given ISO week
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${fmt(monday)} – ${fmt(sunday)}, ${year}`;
}
