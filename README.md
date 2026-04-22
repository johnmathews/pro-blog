# Pro Blog

Personal technical blog at [johnmathews.is](https://johnmathews.is) — built with Next.js 13 (Pages Router), Tailwind CSS, and MDX.

## Local development

```bash
npm run dev        # Next.js dev server
npm run start      # Dev server with hot reload for content changes
```

Then visit http://localhost:3000.

## Build and deploy

```bash
npm run build      # Next.js build + sitemap + Algolia search index
```

Push to `main` to deploy to Vercel. Pushes to other branches trigger preview builds.

## Search and sitemap

```bash
npm run aux        # Regenerate sitemap + Algolia index without a full build
```

These also run automatically as part of `npm run build`.

## Chatbot

An AI chatbot at [/chat](https://johnmathews.is/chat) answers questions about the blog content using OpenAI embeddings stored in Supabase.

```bash
npm run scrape     # Scrape the live site for training data
npm run embed      # Generate OpenAI embeddings and upload to Supabase
npm run chat       # Run scrape + embed together
```

## Keyboard shortcuts

- `?` — show keyboard shortcuts
- `Cmd+K` or `/` — search
- `j`/`k` — scroll down/up
- Usage metrics at [/metrics](https://johnmathews.is/metrics)
