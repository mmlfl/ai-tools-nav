# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

Fresh **Next.js 16.2.6** app (App Router) scaffolded via `create-next-app`. Contains only the default template — no custom features built yet.

- **Language**: TypeScript 5, strict mode
- **Styling**: Tailwind CSS v4 (PostCSS, `@theme inline` — no config file)
- **Fonts**: Geist + Geist Mono via `next/font/google`
- **Path alias**: `@/*` → project root
- **Module resolution**: bundler

## Key Commands

```
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Run production server
npm run lint    # ESLint v9 (flat config in eslint.config.mjs)
```

## File Structure

```
app/
  layout.tsx     # Root layout (Geist fonts, dark mode via CSS vars)
  page.tsx       # Default landing page (placeholder to replace)
  globals.css    # Tailwind v4 + theme variables
next.config.ts   # Empty (default behavior)
tsconfig.json    # Strict, bundler resolution, @/* alias
postcss.config.mjs
eslint.config.mjs
```

## Notes

- No database, API routes, auth, or state management — blank slate
- Dark mode is CSS-variable driven via `prefers-color-scheme` in `globals.css`
- No Cursor/Copilot rules or additional docs beyond README.md
