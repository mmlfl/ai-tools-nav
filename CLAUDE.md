# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**AI Tools Nav** — bilingual (zh/en) AI tools directory with 43+ tools, comparison articles, and usage guides. Static Next.js 16 site deployed at `lflaitool.top`.

Tech stack: TypeScript 5 strict, Tailwind CSS v4, Next.js 16 App Router, React 19.

## Commands

```
npm run dev          # Dev server (Turbopack)
npm run build        # Production build (SSG)
npm run lint         # ESLint v9
python python-service/generate_compare.py   # Generate 5 compare articles (LangChain + Qwen)
python python-service/generate_guide.py     # Generate 5 guide articles (LangChain + Qwen)
```

The Python scripts need a `.env` with `OPENAI_API_KEY` / `OPENAI_API_BASE` / `MODEL_NAME`, and write to `content/{compare,guide}/zh/`.

## Architecture

### Routing (i18n via `[lang]` dynamic segment)

All pages live under `app/[lang]/`. Supported locales: `zh`, `en`. Every page is statically generated at build time (`generateStaticParams`).

| Route | File | Purpose |
|-------|------|---------|
| `/[lang]` | `app/[lang]/page.tsx` | Home — hero, module cards, featured tools |
| `/[lang]/tools` | `app/[lang]/tools/page.tsx` | Full tools grid with search + category/pricing filters |
| `/[lang]/tool/[slug]` | `app/[lang]/tool/[slug]/page.tsx` | Tool detail + related tools, compare, guide crosslinks |
| `/[lang]/compare` | `app/[lang]/compare/page.tsx` | Compare article listing |
| `/[lang]/compare/[slug]` | `app/[lang]/compare/[slug]/page.tsx` | Single compare article (Markdown rendered) |
| `/[lang]/guide` | `app/[lang]/guide/page.tsx` | Guide article listing |
| `/[lang]/guide/[slug]` | `app/[lang]/guide/[slug]/page.tsx` | Single guide article (Markdown rendered) |
| `/[lang]/category/[category]` | `app/[lang]/category/[category]/page.tsx` | Tools filtered by category |

Root `app/layout.tsx` is a transparent pass-through; actual `<html>`/`<body>` shell lives in `app/[lang]/layout.tsx`. The root layout exists so `app/globals.css` and `app/sitemap.ts` / `app/robots.ts` can live at the root.

### Data layer

- **`data/tools.json`** — single source of truth for all 43+ tools. Each entry has `slug`, `name`, `name_en`, `description`, `description_en`, `url`, `category`, `tags`, `pricing`, `featured`. Imported directly at build time (JSON module).
- **`content/compare/{locale}/*.md`** — comparison articles (21 pairs × 2 locales). YAML frontmatter: `title`, `description`, `tools: string[]`, `date`.
- **`content/guide/{locale}/*.md`** — usage guides (20 tools × 2 locales). YAML frontmatter: `title`, `description`, `tool: string`, `date`.
- **`dictionaries/{locale}.json`** — all UI strings keyed by section (`home`, `tools`, `compare`, `guide`, `tool`, `category`, `chat`, `metadata`, `footer`). Loaded via `lib/dictionary.ts` with dynamic import (cached).
- **`lib/content.ts`** — reads Markdown files with `gray-matter` + `marked`, resolves tool references from `tools.json`, provides cross-reference helpers (`getComparePagesForTool`, `getGuidePageForTool`).

### Components

- **`ToolCard`** — reusable card (name, description, category badge, pricing, tags, link to detail page). Used across home, tools grid, category page, tool detail, compare detail.
- **`ToolGrid`** — client component with search input + category filter + pricing filter + result grid. Used on `/tools` page.
- **`SearchableGrid`** — generic search/filter listing for compare and guide pages (client component).
- **`ChatProvider` + `RecommendChat`** — floating chat widget (bottom-right bubble). Client-side SSE streaming to external Python FastAPI backend. Lazy-loaded via `<Suspense>` in layout.
- **`StructuredData`** — JSON-LD schema components (`WebSite`, `BreadcrumbList`, `SoftwareApplication`, `Article`) for SEO.
- **`LanguageSwitcher`** — switches between `/[lang]/...` paths, preserving the rest of the route.
- **`BackLink`, `PillButton`, `EmptyState`, `CategoryFilter`, `SearchBar`** — small reusable UI pieces.

### Types (`types/tool.ts`)

- `Category` — `"chat" | "image" | "video" | "code" | "audio" | "office" | "search"`
- `Pricing` — `"free" | "freemium" | "paid" | "waitlist"`
- `Tool`, `ComparePage`, `GuidePage`, `CompareFrontmatter`, `GuideFrontmatter`
- Helper functions: `tName()`, `tDesc()`, `getCategoryLabel()`, `getPricingLabel()` — locale-aware accessors

### Styling

Tailwind CSS v4 with `@theme inline` (no `tailwind.config.ts`). Dark mode via `prefers-color-scheme` media query with CSS custom properties. Brand gradient: blue-500 → violet-500. Custom animations defined in `globals.css` (fade-in-up with staggered delays via `.animate-in-1` through `.animate-in-6`).

### SEO

- `app/sitemap.ts` — generates sitemap.xml with all static pages, tools, compare articles, guide articles (zh + en)
- `app/robots.ts` — allows all crawlers, points to sitemap
- `components/StructuredData.tsx` — JSON-LD breadcrumbs, SoftwareApplication, Article, WebSite
- `generateMetadata()` exported from every page

### Chat backend

The RecommendChat component connects to an external Python API (`NEXT_PUBLIC_API_URL`, defaults to `http://localhost:8000`). It sends `POST /api/recommend` with `{query}` and reads SSE stream chunks. The backend is a separate FastAPI service (not in this repo).

## Key patterns

- **All pages are async server components** that `await params`, check locale validity, load dictionary + content at build time.
- **Content is locale-aware but slug-universal** — slugs are the same across zh/en; `getCompareDir()` falls back to `zh` if locale dir doesn't exist.
- **Cross-referencing** — tool detail pages link to related compare articles and guide; compare articles link to tool cards + guides; guide articles link to the tool + related compares.
- **No client-side data fetching except the chat widget** — everything else is build-time static.
- **`server-only` import** in `lib/dictionary.ts` and `lib/content.ts` prevents accidental client-side usage of Node APIs.

## Adding new content

1. **New tool** — add entry to `data/tools.json` (all fields required)
2. **New compare/guide article** — add `.md` file to `content/{type}/{locale}/` with proper YAML frontmatter. Slugs in frontmatter must match existing tool slugs in `tools.json`.
3. **Auto-generate articles** — run the Python scripts in `python-service/`. They read `tools.json`, call Qwen via LangChain, and write to `content/{compare,guide}/zh/`. Limited to 5 articles per run.
