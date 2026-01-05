# SRP Articles SPA

A Single Page Application built with **React + TypeScript**, designed around the **Single Responsibility Principle (SRP)**.

The app fetches articles from an open API, displays them as cards, supports keyword-based filtering with relevance ranking, and highlights matched keywords.

- **Repository:** [srp-articles-spa][repo]
- **Live demo (Netlify):** [Open app][demo]

[repo]: https://github.com/Opokhvalenko/srp-articles-spa
[demo]: https://soft-snickerdoodle-fd69c8.netlify.app/

---

## Requirements Coverage

### Home page
- Loads **100 articles** from an open API (**Spaceflight News API v4**)
- Renders cards with:
  - **title**
  - **description preview (≤ 100 chars, optionally centered around the first match)**
- Clicking a card navigates to an **Article page**

### Article page
- Displays **title** and **full description** for the selected article
- Includes a safe **Back** behavior (fallback to Home when history is not available)

### Filtering
- Input supports **multiple keywords** (space-separated)
- Shows articles where **at least one** keyword matches in:
  - `title` (higher priority)
  - `description`
- Results are **ranked** with strict priority: `title` matches > `description` matches
- Matched keywords are **highlighted in yellow** in both title and description

### Matching rules
- The query is tokenized into unique keywords (letters/digits only, case-insensitive).
- Matching is performed at a **word start boundary** (unicode-aware).  
  Example: `liv` matches **live**, but not `de**liv**ers`.

---

## Tech Stack
- **React** + **TypeScript**
- **SCSS (SASS)** as CSS preprocessor
- **Material UI**
- **Zustand** (state management)
- **Zod** (API response validation)
- **ESLint + Biome + Stylelint** (code quality)
- **Husky + lint-staged** (pre-commit checks)
- **GitHub Actions CI** (build + quality checks)

---

## Architecture (SRP-focused)

- **API layer**: `src/api/articlesApi.ts`  
  - `fetchJson` + `fetchAndParse` helpers  
  - runtime validation via **Zod**
  - mapping from API model → domain model

- **State (single source of truth)**: `src/features/articles/store/useArticlesStore.ts`  
  - list state + filter state + selected article state  
  - persistence via `persist` middleware (**sessionStorage**) for `filter` 

- **Derived state**: `src/features/articles/store/articlesSelectors.ts`  
  - `selectKeywords`
  - `selectFilteredArticles`  
  - memoized selectors to avoid unnecessary recalculation

- **Domain utilities**: `src/features/articles/utils/filterArticles.ts`  
  - keyword parsing, filtering, scoring/sorting, truncation

- **UI components**
  - `HighlightedText` (UI-only keyword highlighting)
 - pages are intentionally kept thin: mostly rendering + wiring to store/hooks

- **Routing**: `src/router/index.tsx`
  - `/` and `/articles/:id`
  - code-splitting via `React.lazy` + `Suspense`
  - unknown routes redirect to `/`

- **Stability**
  - global `ErrorBoundary` to handle unexpected UI runtime errors gracefully
  - `ScrollToTop` on route change

---

## Getting Started

Install dependencies:

```bash
npm ci
```

## Scripts

### Development
```bash
npm run dev
npm run preview
```
### Build

```bash
npm run build
```

### Lint & format
```bash
npm run lint:eslint
npm run lint:biome
npm run lint:styles
npm run verify
```

### Auto-fix
```bash
npm run fix
npm run format:fix
npm run fix:styles
npm run fix:all
```
