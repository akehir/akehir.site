# Proposal

## Why

The blog (`/blog`) is a single flat, newest-first list of 43 visible entries (44 registered, 1 hidden) spanning 2007–2026, with no way to search or filter. Finding a post means scrolling the whole list or relying on Google. The metadata needed to search already exists — every entry in `blogEntries` (`src/app/pages/blog/blog.module.ts`) carries `title`, `categories`, `publishedDate`, `modifiedDate`, and `hidden` — so the feature is client-side filtering over a static corpus: no backend, no search index, no new dependency, and results stay consistent with the RSS feed's visibility rule (hidden entries are excluded).

## What Changes

- **New shared search model** in `src/app/pages/blog/blog-search.model.ts`: a `BlogSearchCriteria` interface (`query`, `categories`, `fromDate`, `toDate`, `sort`), a `BlogSearchResult` view model (entry + matched categories), and pure, framework-free functions — `matchesQuery` (per-word, case/diacritic-insensitive title search), `applyBlogSearch` (filters the full list, keeps newest-first), `getBlogSearchCriteria`/`serializeBlogSearchCriteria` (URL `?params`), and `getBlogSearchOptions` (category + year options derived from the corpus, years descending, with per-category counts).
- **New reusable filter UI** (`BlogSearchFilterComponent` + `BlogSearchResultListComponent`) in `src/app/pages/blog/`: a single text field (placeholder "Search titles…", debounced 250 ms), a category `<select multiple>` populated from the corpus, and a From/To date range using native `<input type="date">` (min 2007-01-01, max 2026-12-31 — the corpus span, recomputed at runtime). The results list keeps the existing 5rem gradient entry styling and shows a result count (e.g. "12 of 43"), an empty state with a "Clear search" action, and matched categories per result.
- **Integrated filters on `/blog`** (no new route): `EntriesComponent` grows a `BlogSearchFilterComponent` block above the list; the list renders the filtered results (with the search link appended when any filter is active). With all filters off, the rendered output is identical to today.
- **New dedicated page `/blog/search`** (child route of `BlogComponent`, no nav link): `BlogSearchComponent` restores its criteria from the URL, renders the same filter + result components, and syncs every filter change back into the query params (`queryParamsHandling: 'merge'`, which drops params set to `null`) — so the page is fully shareable/bookmarkable (e.g. `/blog/search?q=traefik&categories=Self-Hosting,Infrastructure&from=2025-01-01&to=2025-12-31`).
- **Styling** for the filter controls and result rows in `src/app/pages/blog/blog.scss` (the blog's global stylesheet, already imported by `src/styles.scss`); Tailwind allowed where it fits the existing aesthetic.
- **Generated files: all unchanged.** The new `search` route is a _child_ route inside `blog.module.ts`; the generators parse only top-level routes from `app-routing.module.ts` plus the parameterized-route data sources — none of which this change touches. `src/prerender-routes.txt`, `src/assets/sitemap.xml`, and `src/assets/rss.xml` all stay byte-identical (verified with the generators' `--check` modes). In particular, `/blog/search` must **not** appear in `sitemap.xml`: `tools/generate-rss-feed.mjs`'s cross-check fails the run on any `/blog/*` URL in the sitemap without a matching `blogEntries` entry.
- **Unit tests** for the model (query matching, filtering, URL (de)serialization, options) and light component specs (`BlogSearchFilterComponent`, `BlogSearchComponent`) following the existing zoneless `TestBed` pattern.
- **Docs**: `AGENTS.md` gains a short "Blog Search" section (the filter query params, the sitemap exclusion rule with its rationale, and where the shared model/components live); `MEMORANDUM.md` gets a one-line note. The existing blog post workflow is unchanged.

## Capabilities

### New Capabilities

- `blog-search`: how the blog list can be searched and filtered — title-only matching semantics, the category and date-range filters, the shared filter UI, the integrated `/blog` behaviour, and the shareable `/blog/search` page with its URL parameter contract.

### Modified Capabilities

<!-- none: no existing capabilities/specs are tracked under openspec/specs/ -->

## Impact

- **Dependencies**: none. `@angular/cdk` is already a dependency (focus trap) but is not required for this feature.
- **Files (new)**: `src/app/pages/blog/blog-search.model.ts` (+ spec), `src/app/pages/blog/search-filter.component.ts` (+ spec), `src/app/pages/blog/search-result-list.component.ts`, `src/app/pages/blog/search.component.ts` (+ spec), and their templates if split out.
- **Files (changed)**: `src/app/pages/blog/entries.component.ts`, `src/app/pages/blog/entries.component.html`, `src/app/pages/blog/blog.module.ts` (route + imports + a small `visibleBlogEntries()` helper only), `src/app/pages/blog/blog.scss`, `AGENTS.md`, `MEMORANDUM.md`. No generated file (`prerender-routes.txt`, `sitemap.xml`, `rss.xml`) is modified.
- **Routing**: one new child route `search` under `/blog` (inside `blog.module.ts`); the root routing table in `app-routing.module.ts` is untouched, so the sitemap/prerender generators' parsing is unaffected.
- **SEO**: no change — `/blog/search` is intentionally absent from the sitemap (client-rendered results of a static corpus; the canonical content is the prerendered entry pages).
- **Behavioural**: none for the unfiltered `/blog` list (must remain pixel-identical); hidden entries remain excluded everywhere, matching the RSS feed.
