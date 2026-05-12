# AI Tools Navigation Site Design

**Date:** 2026-05-12
**Approach:** Data-driven (JSON) static site

## Architecture

```
ai-tools-nav/
├── data/tools.json          # Tool data source
├── app/
│   ├── layout.tsx           # Root layout (Navbar + Footer)
│   ├── page.tsx             # Homepage (category cards + tool grid)
│   ├── [category]/page.tsx  # Category filter page
│   └── tool/[slug]/page.tsx # Tool detail page
└── components/              # UI components
    ├── Navbar.tsx
    ├── ToolCard.tsx
    ├── SearchBar.tsx
    ├── CategoryFilter.tsx
    └── Footer.tsx
```

## Data Model (tools.json)

```json
{
  "slug": "chatgpt",
  "name": "ChatGPT",
  "description": "...",
  "url": "https://chat.openai.com",
  "category": "chat",
  "tags": ["对话", "写作"],
  "pricing": "freemium",
  "featured": true,
  "icon": "/icons/chatgpt.svg"
}
```

**Categories:** chat, image, video, code, audio, office, search
**Pricing:** free, freemium, paid, waitlist

## Pages

1. **Homepage** — Hero + category tabs + pricing filter + search bar + tool card grid
2. **Category page** `/[category]` — Same as homepage but filtered by category
3. **Detail page** `/tool/[slug]` — Tool icon, name, description, tags, pricing, visit link, related tools

## Features

- Real-time search filtering
- Category + pricing filter
- Tool detail page with related tools
- Dark mode (CSS variable driven, existing)
- Responsive layout (mobile → grid columns reduce)
- Empty state when no tools match filters

## Tech Stack

- Next.js 16 App Router (TypeScript)
- Tailwind CSS v4
- No external dependencies beyond scaffold
