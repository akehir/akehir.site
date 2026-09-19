# Blog Search & Filtering — Implementation Plan

> Status: plan / proposal (not yet implemented)
> Change name: `add-blog-search`

## 1. Context & Current State

- `akehir.site` is a static personal site built with **Angular 22** (standalone
  components, signals, `@angular/cdk`), **Tailwind CSS v4** + SCSS.
- Blog posts live at `src/assets/blog/<year>/<slug>.md` and are registered in
  the `blogEntries` array in `src/app/pages/blog/blog.module.ts`
  (`EntryCategory` union + `BlogData` interface: `title`, `author`,
  `categories`, `mainCategory`, `publishedDate`, `modifiedDate`,
  `routerLink`, `content`, `source`, `hidden?`).
- `src/app/pages/blog/entries.component.ts` renders all non-hidden entries,
  newest-first, on `/blog`, with an RSS Feed link.
- `tools/` already contains Node generators that parse `blog.module.ts` and
  emit committed generated files with a `--check` mode for CI:
  `generate-rss-feed.mjs` → `src/assets/rss.xml`,
  `generate-sitemap.mjs` → `src/assets/sitemap.xml`,
  `generate-prerender-routes.mjs` → `src/prerender-routes.txt`.
- The site has **no backend**; everything must be client-side or pre-generated.

## 2. Goal

Blog post search with faceted filtering, available in **two places** (same
shared component):

1. **Dedicated search page** at `/blog/search`.
2. **Inline search box atop the `/blog` entry list** (in `EntriesComponent`),
   which filters the list in place.

Both use the **same `BlogSearchComponent`**, so behavior and state are
identical regardless of entry point.

Capabilities (all combinable, results update live):

| Capability | Field | Behavior |
| --- | --- | --- |
| Full-text query | title + body + categories + author | weighted relevance ranking |
| Tag / category filter | `categories: EntryCategory[]` | multi-select chips, OR within a facet, AND across facets |
| Group / main category filter | `mainCategory: EntryCategory` | multi-select chips |
| Author filter | `author` | multi-select (single author today, multi-ready) |
| Date range | `publishedDate` **and** `modifiedDate` | `from` / `to` (`YYYY-MM-DD`, inclusive); an entry matches if either date falls in range |
| Sort | — | relevance (when a query is present), newest, oldest, title A–Z |
| Deep links | URL query params | `?q=&cat=&group=&author=&from=&to=&sort=` — shareable, back/forward safe |

## 3. Architecture (client-side, no backend, no new runtime deps)

```
blog.module.ts (source of truth)
        |
        v
tools/generate-search-index.mjs  (Node, --check for CI)
        |
        v
src/assets/search-index.json  (committed generated file)
        |
        v
SearchIndexService (Angular: fetch once, cache in signal)
        |
        v
search(query, filters) -> ranked results (pure function)
        |
        v
BlogSearchComponent (shared: used on /blog/search page AND inline on /blog list)
```

### 3.1 Generated search index — `src/assets/search-index.json`

New generator `tools/generate-search-index.mjs` mirroring the existing
generators:

- Parse `blogEntries` from `blog.module.ts` (reuse the field-parsing approach
  of `generate-rss-feed.mjs`).
- Load each entry's Markdown `content` file, strip Markdown to plain text
  (reuse the already-present `marked` dependency) so the index is
  token-searchable without shipping raw Markdown.
- Emit an array of:
  ```json
  {
    "slug": "git-reset",
    "title": "git reset",
    "author": "Raphael Ochsenbein",
    "mainCategory": "Programming",
    "categories": ["Programming", "git"],
    "publishedDate": "2025-03-20",
    "modifiedDate": "2025-03-20",
    "routerLink": "/blog/git-reset",
    "content": "<plain text extracted from the Markdown>"
  }
  ```
- **Exclude `hidden` entries** (consistent with RSS/sitemap).
- **`--check` mode** → exits non-zero if the committed index is out of date
  (so CI catches drift, exactly like the other generators).
- It is a **generated file — do not edit by hand**.

### 3.2 Angular service — `src/app/pages/blog/search/search-index.service.ts`

- `@Injectable({ providedIn: 'root' })`.
- Fetch `/assets/search-index.json` **once** and cache in a `signal`.
- Expose `search(query: string, filters: SearchFilters): SearchResult[]` as a
  **pure function** (easily unit-testable, no Angular DI needed for the logic).
- Derive the **available facet values** (distinct categories, main categories,
  authors, min/max dates) from the index at runtime so the UI always matches
  the data.

### 3.3 Search model — `src/app/pages/blog/search/search.model.ts`

```ts
interface SearchFilters {
  query?: string;
  categories?: EntryCategory[];   // tag filter (multi)
  mainCategory?: EntryCategory[]; // group filter (multi)
  author?: string[];              // author filter (multi)
  from?: string;                  // YYYY-MM-DD (inclusive)
  to?: string;                    // YYYY-MM-DD (inclusive)
  sort?: 'relevance' | 'newest' | 'oldest' | 'title';
}

interface SearchResult {
  entry: IndexEntry;
  score: number;          // relevance score
  snippet?: string;       // match-context excerpt with <mark> highlights
}
```

### 3.4 Ranking (simple, no new dependency)

- **Tokenize** the query: lowercase, split on non-alphanumeric, drop
  stopwords (the, a, an, and, or, ...).
- **Weighted scoring** per entry:
  - title match: high weight (e.g. 5 per token hit)
  - categories / mainCategory match: medium (e.g. 2)
  - author match: medium (e.g. 2)
  - body content match: low (e.g. 1, capped)
- **Date filter**: an entry matches when `publishedDate` **or**
  `modifiedDate` lies within `[from, to]` (both inclusive; string comparison
  works because dates are `YYYY-MM-DD`).
- When `query` is non-empty → sort by score desc (tie-break newest).
- When no query → sort by the chosen `sort` (default newest).
- **Snippet**: find the first body match, emit ~120 chars around it; matched
  terms are wrapped in `<mark>` for highlighting (styled to the site palette).

### 3.5 Shared UI — `src/app/pages/blog/search/search.component.{ts,html,scss}`

One component, used in two places:

- **Search input**: `<input>` bound to a signal; debounce ~200 ms
  (`debounceTime` + `toSignal`) before filtering.
- **Facet controls** (all derived from the index, so always in sync):
  - Category (tag) chips — multi-select toggle.
  - Main category (group) chips — multi-select toggle.
  - Author select (chips if > 1 author later).
  - Date `from` / `to` — `<input type="date">`.
  - Sort `<select>` (relevance / newest / oldest / A–Z).
- **Results list**: reuse the existing entries-list styling (gradient text,
  large type) — each result is an `<a routerLink>` to `entry.routerLink`,
  showing title, date, category chips, and the snippet with `<mark>`-highlighted
  matches.
- **Meta**: result count ("N results") + a "Clear all filters" button.
- **Empty state**: friendly message + "Clear filters".
- **Loading / error**: subtle loading state while the index fetches; error
  state if the index is missing.
- **Styling**: Tailwind-first; a `search.scss` (or extend `blog.scss`)
  matching the existing aesthetic.

### 3.6 Two entry points, one component

- **Dedicated page**: new child route `{ path: 'search', ... }` in
  `blog.module.ts` rendering `SearchPageComponent` — a thin wrapper whose
  template is just the `<ake-blog-search>` component (plus page-level heading).
- **Inline atop the `/blog` list**: `EntriesComponent` renders
  `<ake-blog-search mode="inline">` above the entry list. In inline mode the
  component filters the list in place (no navigation). The search state is
  still synced to query params on the current route, so filtered list views
  are deep-linkable too.
- The shared component takes a small input (`mode: 'page' | 'inline'`,
  default `page`) to adjust layout/presentation only — search logic, filters,
  and URL sync are identical in both modes.
- Add a **"Search"** affordance on the `/blog` page (e.g. a small link/button
  next to the RSS Feed link) that deep-links to `/blog/search` with the
  current filter state.

### 3.7 Routing & URL state

- Query params: `?q=&cat=&group=&author=&from=&to=&sort=`.
  - `cat` / `group` / `author`: comma-separated values.
  - On navigation, read params → initialize the filter signals.
  - On filter change, write params back (replace navigation, no history spam).
  - Results are shareable and browser back/forward works on both `/blog`
    (inline) and `/blog/search` (page).
- Register the new `/blog/search` route in `blog.module.ts`.

## 4. Files to add / change

| File | Change |
| --- | --- |
| `tools/generate-search-index.mjs` | **new** generator (+ `--check`) |
| `src/assets/search-index.json` | **new** generated index (committed) |
| `src/app/pages/blog/search/search.model.ts` | **new** types |
| `src/app/pages/blog/search/search-index.service.ts` (+ spec) | **new** fetch + pure search |
| `src/app/pages/blog/search/search.component.ts` / `.html` / `.scss` (+ spec) | **new** shared search UI |
| `src/app/pages/blog/search/search-page.component.ts` | **new** thin `/blog/search` wrapper |
| `src/app/pages/blog/blog.module.ts` | register `/blog/search` route |
| `src/app/pages/blog/entries.component.ts` / `.html` | embed inline `<ake-blog-search>` + Search link |
| `src/assets/sitemap.xml` | regenerate (new route) |
| `src/prerender-routes.txt` | regenerate (new route) |
| `tools/generate-rss-feed.mjs` | add `/blog/search` to static-pages cross-check if needed |
| `AGENTS.md` | document new generator + add to Blog Post Workflow |
| `.gitlab-ci.yml` | run new generator `--check` alongside the others |

## 5. Implementation steps (ordered)

1. **`tools/generate-search-index.mjs`** — parse entries, load Markdown,
   strip to plain text, emit `search-index.json`; implement `--check`.
2. **`search.model.ts`** — `SearchFilters`, `SearchResult`, sort union.
3. **`search-index.service.ts`** — fetch/cache index; pure
   `search(query, filters)` with tokenize + weighted scoring + sort + snippet;
   facet derivation.
4. **`search.component.{ts,html,scss}`** — shared UI: inputs, facet chips,
   results, `<mark>` snippet highlighting, count, empty state, clear-filters,
   `mode` input (`page` / `inline`).
5. **`search-page.component.ts`** + route `/blog/search` in `blog.module.ts`;
   **embed the inline component in `EntriesComponent`**; query-param sync for
   both.
6. **Styling** — `search.scss` (Tailwind-first) matching `blog.scss`, plus a
   `<mark>` highlight style.
7. **Regenerate assets** — run the generator; run `--check` for all
   generators to confirm no drift.
8. **Tests** — unit tests for `search()` (query matching, each facet, combined
   filters, date range on publishedDate/modifiedDate, sorts, empty query,
   hidden excluded) + light component render tests (page + inline).
9. **Docs/CI** — update `AGENTS.md` (new generator section + Blog Post
   Workflow step) and `.gitlab-ci.yml` to run the new `--check`.
10. **Quality gates** — `npm run lint` / `npm run lint:fix`, `npm test`,
    `npm run build`; verify UI responsiveness + accessibility.

## 6. Decisions (confirmed)

- **Two entry points, one component**: a dedicated `/blog/search` page **and**
  an inline search box atop the `/blog` list, both rendering the same shared
  `BlogSearchComponent`.
- **Date filter covers both dates**: an entry matches when `publishedDate`
  **or** `modifiedDate` is within the `from`/`to` range.
- **Highlighting**: matched terms in snippets are wrapped in `<mark>`, styled
  to the site palette.

## 7. Non-goals / other decisions

- **No backend search** — the site is static; client-side + generated index is
  the right fit.
- **No fuzzy / typo-tolerant search in v1** — exact token match + weighted
  relevance. (Fuse.js or similar is a possible v2 if recall needs improve.)
- **No new npm dependency** — reuse `marked` (already in deps) for
  Markdown→plain-text.
- **Author filter is multi-valued** even though there is one author today, so
  future multi-author posts "just work".
- The index is **regenerated at authoring time** (like the RSS feed), not at
  build time, keeping the existing committed-generated-file model.
- Hidden entries are **excluded** from the index (matches RSS/sitemap).
- No changes to how individual entry pages render Markdown, and no changes to
  the `BlogData` shape in `blog.module.ts`.
