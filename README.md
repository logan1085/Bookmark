# Bookmark

Live site:

- https://bookmark-black-eight.vercel.app/

Bookmark is an AI-curated reading digest built around one simple idea: most readers do not want more content, they want better filtering.

The product delivers three strong articles each week, with summaries and lightweight curation, so the experience feels more like signal compression than newsletter sprawl.

## What it does

- curates weekly article digests
- summarizes links into faster-to-scan takes
- collects subscribers
- supports both static and live digests
- uses AI as part of the editorial workflow rather than as gimmick copy

## Why it exists

This project reflects a product pattern I care about:

- using AI to reduce noise instead of increase it
- turning content overload into something usable
- combining product judgment, workflow design, and distribution

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech

- Next.js
- TypeScript
- Supabase
- Resend
- Anthropic SDK
- Tailwind CSS

## Notes

- Static fallback content and live digests coexist, with live entries taking priority when present.
- The product is designed around calm UX and email-style distribution rather than feed addiction.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
