# vawnnam.blog

Personal blog and portfolio built with TanStack Start, React 19, and deployed on Cloudflare Workers.

## Features

- **Blog** — Markdown posts with syntax highlighting, reading progress bar, and Giscus comments
- **Gear** — Hardware and equipment reviews
- **About / Resume** — Profile page with embedded PDF viewer and downloadable CV
- **Search & filter** — Full-text search and tag filtering across posts
- **Dark / light mode** — Persistent theme with no flash on load (SSR-safe)
- **Related posts** — Suggested articles based on shared tags
- **Mark as read** — Tracks read articles via localStorage (scroll + 30 s triggers)
- **SSR** — Server-side rendering for SEO and performance

## Tech Stack

| Layer         | Library                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| Framework     | [TanStack Start](https://tanstack.com/start) (React 19)                          |
| Routing       | [TanStack Router](https://tanstack.com/router) (file-based)                      |
| Data fetching | [TanStack Query](https://tanstack.com/query) with SSR                            |
| State         | [Zustand](https://zustand-demo.pmnd.rs/)                                         |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com/) + shadcn/ui                          |
| Markdown      | unified · remark-gfm · rehype-highlight · rehype-slug · rehype-autolink-headings |
| PDF           | react-pdf                                                                        |
| Comments      | [Giscus](https://giscus.app/) (GitHub Discussions)                               |
| Build         | Vite                                                                             |
| Language      | TypeScript                                                                       |
| Tests         | Vitest + Testing Library                                                         |
| Deploy        | Cloudflare Workers (Wrangler)                                                    |

## Project Structure

```
src/
├── routes/          # File-based routes (TanStack Router)
│   ├── __root.tsx   # Root layout — NavBar, Footer, theme injection
│   ├── index.tsx    # Home page
│   ├── blog/
│   │   ├── index.tsx    # Blog list with search & tag filter
│   │   └── $blogId.tsx  # Individual post + comments
│   ├── about/
│   │   └── index.tsx    # About + PDF resume
│   └── $.tsx        # 404 page
├── components/      # Shared UI components
├── data/            # Markdown content (blogs, gears, about)
├── helpers/         # Markdown parsing, date formatting, reading time
├── store/           # Zustand stores
├── constants/       # Menu items, theme values
└── types/           # TypeScript types (Article, etc.)
```

Content lives in `src/data/` as Markdown files with YAML frontmatter:

```yaml
---
title: My Post
date: 2025-01-01
tags: [react, typescript]
draft: false
summary: A short description.
---
```

Draft posts are excluded from the public build.

## Getting Started

```bash
npm install
npm run dev        # dev server at http://localhost:3000
```

## Scripts

| Script           | Description                                 |
| ---------------- | ------------------------------------------- |
| `npm run dev`    | Start dev server on port 3000               |
| `npm run build`  | Production build                            |
| `npm run serve`  | Preview production build locally            |
| `npm run test`   | Run unit tests                              |
| `npm run lint`   | Lint with ESLint                            |
| `npm run check`  | Prettier + ESLint fix                       |
| `npm run deploy` | Bump version → build → deploy to Cloudflare |

## Deployment

Hosted on **Cloudflare Workers**. The deploy script (`src/lib/release-version-cli.ts`) bumps the version, Vite builds, then Wrangler deploys.

```bash
npm run deploy
```
