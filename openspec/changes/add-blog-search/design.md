# Design

## Context

Current state (verified against the repo, 2026-10-07):

- Angular **22.1.6** app (`@angular/build:application`), **zoneless** (no `zone.js`; specs use `provideZonelessChangeDetection()`). Styling: Tailwind v4 + SCSS; the blog's look lives in `src/app/pages/blog/blog.scss`, imported globally by `src/styles.scss` under the `ake-blog` element selector (components use `encapsulation: ViewEncapsulation.None` + BEM-ish classes, e.g. `.ake-blog-entries--item`).
- **Blog corpus**: `blogEntries: BlogRoute[]` in `src/app/pages/blog/blog.module.ts` — 44 route entries, of which **1 is `hidden: true`** (line 687, `cool-things-with-transformers-in-the-browser` — a stub with empty `content`/dates), so **43 visible entries**. Every entry's `data: BlogData` carries `title`, `categories: EntryCategory[]`, `mainCategory`, `publishedDate`, `modifiedDate`, `routerLink`, `content`, `contentRaw` (full Markdown via `?raw`), `source`, and optional `hidden?: true`. All 43 visible entries carry a non-empty `categories[]`.
- **Corpus shape** (measured from `blog.module.ts`): **15 distinct categories in use** — `ChromeOS`, `CyberSecurity`, `Docker`, `Gaming`, `git`, `Hardware`, `Infrastructure`, `Kubernetes`, `Linux`, `Machine Learning`, `Meta`, `Programming`, `Raphael's Random Rumblings`, `Self-Hosting`, `Software`. The `EntryCategory` union type declares 19 members; 4 of them are currently unused by any entry (`Android`, `Fonduest Memories` (sic — the typo is in the codebase), `Travel`, `Reading`). Published years are **2007, 2014, 2025, 2026** (dense in 2025–2026, sparse in 2007/2014).
- **Current list**: `EntriesComponent` (`entries.component.ts`) maps `blogEntries → BlogData[]`, drops `hidden`, sorts by `publishedDate` desc; template renders plain `routerLink` anchors styled at 5rem with the site's 4-colour gradient (`$color-akehir-cyan/blue/red/yellow` from `src/stylesheets/settings/colors`), plus the "RSS Feed" link at the bottom.
- **Routes**: `blog.module.ts` declares `children: [{ path: '', component: EntriesComponent }, ...blogEntries]` under `BlogComponent` (a bare `<router-outlet>`). `app-routing.module.ts` mounts `/blog` via `loadChildren`. No entry uses the slug `search` (verified by grep), so `/blog/search` is collision-free.
- **Generators** (`tools/*.mjs`, all with `--check` modes; AGENTS.md documents them as the source of truth):
  - `generate-sitemap.mjs` and `generate-prerender-routes.mjs` parse **top-level routes only** from `app-routing.module.ts` (regex over `const routes: Routes = [` … `];`) plus the parameterized-route data (blog entries, projects, colour variants). They do **not** see child routes declared inside `blog.module.ts`.
  - `generate-prerender-routes.mjs` skips `path: ''`, parameterized, and `**` routes; everything else is prerendered.
  - `generate-rss-feed.mjs`'s sitemap cross-check **fails the run** on "blog URLs in sitemap.xml without a matching entry" — any `https://akehir.com/blog/*` URL in `sitemap.xml` that is not a `blogEntries` `routerLink` is an error.
- **Testing**: the in-flight `migrate-karma-to-jest` change (its tasks are unexecuted in this checkout — `package.json` still runs `ng test`) will land the suite on Jest/jsdom with zoneless TestBed. This change's specs must pass on **both** runners.
- **Branching**: working branch is `feature/migrate-to-jest`; master is the integration base.

Constraints that shape the design:

1. **Static site**: no backend; the corpus is compiled into the bundle (the `contentRaw` imports already do this). Search must therefore be pure client-side filtering. The corpus is small (43 visible entries), so a full re-filter on every change is trivially fast — no index, no caching layer.
2. **The RSS/sitemap cross-check** forbids putting `/blog/search` into `sitemap.xml` unless a matching `blogEntries` entry is added (it would also need its own Markdown file — clearly wrong).
3. **Design language**: the blog is intentionally oversized typography (5rem items, 21rem top padding, 55ch column). The filter UI must be visually secondary — quiet, compact, no heavy form chrome.
4. **`hidden` semantics** are the site-wide visibility rule (RSS, sitemap, list, prerender) and must hold for search too.

## Goals / Non-Goals

**Goals:**

- Search blog entry **titles** (client-side, instant, no index).
- Filter by **categories** (multi-select, AND semantics) and by **publication date range** (from/to, inclusive, day precision).
- One reusable filter UI used in **both** placements: integrated into `/blog` and the dedicated `/blog/search` page (no nav link).
- Shareable `/blog/search` state via URL query params.
- Zero change to the unfiltered `/blog` list's output; hidden entries never appear.
- Unit-tested model; specs green on Karma and on the (in-flight) Jest migration.

**Non-Goals:**

- Full-text search over post bodies (`contentRaw`) or category-name matching in the query — explicitly out of scope per user decision; titles only. The model keeps `contentRaw` out of `BlogSearchResult` deliberately so adding it later is a one-line extension.
- A navigation menu entry for search (explicitly not wanted).
- Search ranking/scoring, synonyms, fuzzy/typo tolerance (beyond diacritic folding), or highlighting matches in the title (titles are long at 5rem — highlighting is a visual concern for a follow-up).
- Any sitemap, RSS, or prerender route-file change (all three generated files remain byte-identical — see D9).
- Virtual scrolling or pagination (43 rows ≪ any threshold).
- Persistence of filter state in `localStorage` (the URL is the persistence mechanism).
- i18n of the control labels (site is single-language English today).

## Decisions

### D1: Pure model + two reusable components (no service layer)

All search logic lives in `src/app/pages/blog/blog-search.model.ts` as exported, dependency-free functions over plain data. No injectable service: the corpus is a static module-level array, and a service would add a DI surface with no consumers beyond the two components.

- `BlogSearchCriteria` (see D4) — plain object, the single source of truth for filter state.
- `matchesQuery(entry, query)` — boolean per entry (D5).
- `applyBlogSearch(entries: BlogData[], criteria): BlogSearchResult[]` — the full pipeline: filter hidden → query → categories → date range → sort (newest first, stable) → map to view model.
- `getBlogSearchCriteria(queryParams: Record<string, unknown>): BlogSearchCriteria` and `serializeBlogSearchCriteria(criteria: BlogSearchCriteria): { [key: string]: string | string[] | null }` — URL (de)serialization (D4); both take/return plain values so they are trivially unit-testable and runner-independent.
- `getBlogSearchOptions(entries: BlogData[]): BlogSearchOptions` — `{ categories: { name: EntryCategory; count: number }[]; years: number[]; minDate: string; maxDate: string }` (D3).
- Both components call these functions via `computed()`; `applyBlogSearch` over ≤44 items is nanoseconds, so no memoization is needed.

**Alternative considered**: an injectable `BlogSearchService` holding a `criteria` signal shared by both placements — rejected: the two placements live on different routes and are never mounted simultaneously; a shared service would imply shared state that doesn't exist and would complicate testing.

### D2: `BlogSearchResult` view model (not raw `BlogData`)

The result list renders `BlogSearchResult { title: string; routerLink: string; publishedDate: string; mainCategory: EntryCategory; matchedCategories: EntryCategory[] }` instead of `BlogData`:

- The list never needs `contentRaw` (the full Markdown, already heavy in the bundle) — decoupling keeps the search UI from accidentally growing into a full-text renderer.
- `matchedCategories` (the entry's categories ∩ the selected set) is what makes the result rows useful when a category filter is active; it is computed once in `applyBlogSearch`, not in the template.
- `EntriesComponent`'s existing `entries` (raw `BlogData[]`) stays as-is; when a filter is active it renders the results through the new list component instead of its inline `@for`.

### D3: Options derived at runtime from `blogEntries` (not hardcoded)

`getBlogSearchOptions` computes:

- **categories**: union of the input entries' `categories`, each with a `count` (how many of the input entries carry it); callers pass the visible (hidden-filtered) entries, so the options reflect exactly what is searchable, sorted alphabetically with case-insensitive locale compare. Entries with an empty `categories` array would simply not be represented in the list — they remain findable via query and date only (none exist today, but the model must not crash on them). Runtime derivation is deliberate: the `EntryCategory` union declares 4 categories with zero entries (`Android`, `Fonduest Memories`, `Travel`, `Reading`), and those must not appear as dead options — while categories added to future entries show up automatically.
- **years**: distinct `publishedDate` years, **descending** — used to seed the date inputs' context and shown as hints in the filter (e.g. the From/To `min`/`max`), and to power a future year shortcut if ever wanted.
- **minDate/maxDate**: min/max of `publishedDate` across the input entries → `2007-01-01` / `2026-12-31` today; applied as native `min`/`max` attributes so the browser's date picker can't steer the user into an empty range (free text entry can still exceed it — the model treats out-of-span bounds as the span edges, see D6).

**Alternative considered**: hardcode the 4 years in a year `<select>` — rejected: user chose arbitrary ranges, and a 2026-only year list would be wrong in 6 months.

### D4: URL parameter contract for `/blog/search`

| Param        | Type                        | Meaning                                                                                                                                                                                            |
| ------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`          | string                      | Query text; trimmed; whitespace-split into words                                                                                                                                                   |
| `categories` | string, **comma-separated** | Selected categories (e.g. `Self-Hosting,Machine Learning`). Names are URL-encoded by Angular; the separator is `,` (never appears in a category name — verified against the `EntryCategory` union) |
| `from`       | `YYYY-MM-DD`                | Inclusive lower bound on `publishedDate`                                                                                                                                                           |
| `to`         | `YYYY-MM-DD`                | Inclusive upper bound on `publishedDate`                                                                                                                                                           |
| `sort`       | `newest` \| `oldest`        | Optional; defaults to `newest`. Kept in the contract now even though the UI ships without a sort control (YAGNI for the control, cheap for the contract)                                           |

Rules:

- **Only non-default values are written** (`q` non-empty after trim, `categories` non-empty, `from`/`to` set, `sort` ≠ `newest`); `mergeIntoQuery` drops params set to `null`, so clearing a filter deletes its param. The unfiltered URL is exactly `/blog/search`.
- **Parsing is tolerant**: unknown/empty values fall back to defaults; `from`/`to` that don't parse as `YYYY-MM-DD` are ignored; `from > to` swaps the bounds (rather than showing an error — with 2 controls a swap is the friendlier read and the picker's `min`/`max` already discourage it).
- **The integrated `/blog` list uses the same params** (`/blog?q=…`) so the "Search" affordance on `/blog` deep-links to exactly the state the user just built.
- On `/blog/search`, serialization goes through `this.router.navigate([], { relativeTo: this.route, queryParams: …, queryParamsHandling: 'merge' })` (one history entry per applied change — the text box is debounced, see D7). On `/blog`, the filter itself never writes the URL; only the "Search these results" link carries the current criteria via `[queryParams]` (D7).

### D5: Query semantics — per-word AND on the title

`matchesQuery(entry, query)`:

1. Normalize: `String.normalize('NFD').replace(/[\u0300-\u036f]/g, '')` (strip diacritics — future-proofing for accented titles, e.g. a `Fondue` title), then `toLowerCase()`; also collapse internal whitespace.
2. Trim the query; if empty → matches everything (this is the "no query" case, not a filter).
3. Split on whitespace into words. Entry matches **iff every word** is a substring of the normalized title (AND semantics — standard for short search boxes; OR would surface too much on a 43-entry corpus).
4. Word-boundary matching is deliberately **not** enforced (substring is simpler and `git` matching `GitLab`-style titles is desirable).
5. No stemming, no ranking, no max word count (a 20-word "query" is fine — it just matches nothing; the empty state tells the user so).

### D6: Date-range semantics

- Bounds are **inclusive at day granularity**, compared as `YYYY-MM-DD` **strings** (lexicographic order is correct for ISO dates — no `Date` parsing, no timezone drift, consistent with how the corpus stores dates).
- `from`/`to` are validated with `^\d{4}-\d{2}-\d{2}$`; anything else is treated as unset.
- Out-of-span values (e.g. `from=2000-01-01`) clamp to the corpus span from `getBlogSearchOptions` — the result is "everything ≥ 2007-01-01" rather than "nothing".
- `publishedDate` is the filter field (not `modifiedDate`) — it matches user intuition ("posts from 2025") and the list's own sort key.

### D7: Debounce & sync strategy

- The text input is debounced **250 ms** (`BehaviorSubject` + `debounceTime` from RxJS, already a dependency; Enter flushes immediately, Escape clears).
- **Category and date changes apply immediately** (they are explicit, discrete actions).
- `/blog/search` syncs every _applied_ change into the URL (debounced for the text box, immediate for the rest) with `queryParamsHandling: 'merge'`.
- The integrated `/blog` list does **not** write to the URL on every keystroke — it only navigates when the user clicks the "Search these results" link (which appears as soon as any criterion is non-default). This avoids polluting history with keystrokes and keeps `/blog`'s URL clean by default.
- Focus/keyboard: the filter block is a plain `<form>`-less region (no submit navigation — Enter in the text box just applies the current text immediately, i.e. bypasses the debounce). `Escape` in the text box clears it. All controls are native and therefore keyboard-accessible by default; labels are real `<label>`s (visible, 1rem, dimmed) — no icon-only controls.

### D8: Placement & component tree

```
BlogComponent (ake-blog, <router-outlet>)
├── ''            → EntriesComponent
│     ├── BlogSearchFilterComponent   (integrated mode; criteria from local signals)
│     ├── BlogSearchResultListComponent  (only when a criterion is active)
│     │     └── (falls back to the existing inline @for when no criterion is active)
│     ├── "Search these results" link  (only when a criterion is active)
│     └── RSS Feed link (unchanged)
└── 'search'      → BlogSearchComponent
      ├── BlogSearchFilterComponent   (URL-bound mode)
      └── BlogSearchResultListComponent (always rendered; empty state included)
```

- `BlogSearchFilterComponent`: `input<BlogSearchCriteria>('criteria')` (current state, rendered into the controls on every update) and `input<BlogSearchOptions>('options')`; emits `criteriaChanged: Output<BlogSearchCriteria>` on every applied change (debounced for the text box). It is **dumb**: it never touches the Router and never owns state — the parent keeps the single source of truth (a local signal on `/blog`, the URL on `/blog/search`).
- `BlogSearchResultListComponent`: `input<BlogSearchResult[]>('results')`, `input<number>('total')`, `input<boolean>('hasActiveFilters')`; emits `cleared: Output<void>` from the empty-state button. Renders count, rows, empty state.
- `EntriesComponent` owns its criteria in `signal()` state; `BlogSearchComponent` derives criteria from `ActivatedRoute.queryParams` via `toSignal` + `computed` (single source of truth = the URL).
- **Styling**: new BEM-ish classes under the existing `ake-blog` scoping in `blog.scss`: `.ake-blog-search` (the filter block), `.ake-blog-search--results` (result rows), `.ake-blog-search--empty`. Visual direction: 1rem controls with 1.5rem spacing, 0.1rem-radius underlines (echoing the site's link underline motif), native `select`/`input[type=date]` with transparent background + white text (the blog palette is dark), no borders, `:focus-visible` outline in `$color-akehir-cyan`. Result rows reuse the existing `.ake-blog-entries--item` class so title rows are pixel-identical to the unfiltered list; `matchedCategories` and the per-row date render as 1.2rem dimmed metadata lines. Tailwind utility classes are permitted where they shorten the SCSS (per AGENTS.md), but the existing blog file is SCSS-first — the new block stays in `blog.scss` for consistency.
- The filter block sits **above** the list with `margin-bottom: 5rem`, inside the existing 55ch column (it is part of the same `<div>` in `EntriesComponent`, so the `max-width: 55ch` rule applies for free).

### D9: Route registration & the generator interaction

- Add `{ path: 'search', component: BlogSearchComponent }` to the `children` array of the `''` route in `blog.module.ts` (after `EntriesComponent`, before `...blogEntries` — order is irrelevant for matching since `search` ≠ `''` and ≠ any entry slug, but keeping the non-entry children first reads better), and `BlogSearchComponent` to the module's `imports`.
- `app-routing.module.ts` is **not touched** (the `/blog` `loadChildren` already covers the child).
- **Prerender**: the prerender generator parses top-level routes from `app-routing.module.ts` plus the parameterized data sources; a child route inside `blog.module.ts` is invisible to it, so `src/prerender-routes.txt` is **unchanged** — verified by `node tools/generate-prerender-routes.mjs --check` exiting 0 with a clean `git status`. When prerendering is ever enabled (`angular.json` `prerender.routesFile`), `/blog/search` remains a client-rendered SPA route (its default view is just the filter + the full list — a reasonable static fallback; no action needed).
- **Sitemap**: `node tools/generate-sitemap.mjs --check` must pass **unchanged** (no new URL), and `node tools/generate-rss-feed.mjs --check` must keep passing — the cross-check's "unknown blog URLs" rule is what would break the build if `/blog/search` ever leaked into `sitemap.xml`. AGENTS.md records the exclusion so a future agent doesn't "fix" the sitemap to include the page.

### D10: Accessibility & UX details

- The filter block is a `div` with `role="search"` (no `<form>` element, so no implicit submission/navigation surprises; the region is announced as a search).
- Result count uses `aria-live="polite"` so screen readers hear "12 of 43 entries" after a filter change.
- The text input: `type="search"` (gives the native clear button in most browsers), `autocomplete="off"`, `spellcheck="false"`, `enterkeyhint="search"`.
- Empty state: "No entries match your search." + a "Clear search" button (resets all criteria, emits `cleared`) — the primary affordance for recovery.
- Mobile: the blog's existing 55ch/5rem layout already scales by font-size; the filter block stacks (grid `1fr` under 480px via a media query in `blog.scss`), date inputs stay native (mobile date pickers). No new breakpoint logic beyond that.
- No changes to focus trap / PWA behaviour; the page is not part of the navigation menu.

## Risks / Trade-offs

- [Test-runner split] Specs must pass on Karma **and** on the in-flight Jest migration (whose tasks are not yet executed in this checkout). → Mitigation: specs are plain zoneless `TestBed` + `provideRouter` with no browser-only APIs; the task list verifies on both, and the Jest change's `?raw`/alias module mapping (D3 there) already covers importing `blog.module.ts` in specs. If Jest is not merged yet at review time, "green on Karma" is the gate and the Jest run is re-verified after that merge.
- [`<select multiple>` UX] Native multi-select requires click-while-Ctrl/Cmd and looks dated. → Mitigation: it is the only zero-dependency, fully accessible multi-select; the alternative (a custom chip/tag UI) is a follow-up if it feels wrong in review. The count-per-category in each option helps users know what they're selecting. Documented as a conscious simplicity trade.
- [Diacritic-normalization cost] `normalize('NFD')` per filter pass. → Mitigation: 43 titles; cost is negligible. (A precomputed normalized-title array in `getBlogSearchOptions`-style setup is a one-line optimization if it ever matters.)
- [Date string comparison] Relies on ISO `YYYY-MM-DD` storage. → Verified true for all entries; the RSS generator already parses these as dates, so the format is load-bearing site-wide. A `publishedDate` not matching the regex is rejected by `generate-rss-feed.mjs`, which keeps the invariant enforced.
- [Route-file parser fragility] The generators regex-parse `app-routing.module.ts`; adding the route to `blog.module.ts` sidesteps that fragility entirely. → If someone later hoists the route to the root table, `generate-prerender-routes.mjs` will start emitting `/blog/search` (fine) **and** `generate-sitemap.mjs` will too (fine) — but then `generate-rss-feed.mjs` will **fail** on the unknown blog URL. AGENTS.md must document that `/blog/search` may only be added to the sitemap together with a matching `blogEntries` entry or an exclusion in the generator (follow-up).
- [Two placements, one feature] The `/blog` list and `/blog/search` share 90% of their UI; divergence risk over time. → Mitigation: the shared components + model make divergence structurally unlikely; the spec's "shared filter UI" requirement keeps it honest.
- [Oversized blog typography vs. form controls] 1rem controls inside a 5rem world could look lost. → Mitigation: D8's visual direction (underline motif, dimmed labels, generous spacing); the unfiltered list remains untouched, so the "default" experience is unchanged and the filter is opt-in visual furniture.

## Migration Plan

1. **Branch** off `master` as `feature/blog-search` (single PR; do not stack on `feature/migrate-to-jest` to keep the Jest migration's diff clean — if it merges first, rebase).
2. **Model first**: `blog-search.model.ts` + full unit test suite (pure functions — no TestBed). Green.
3. **Components**: filter + result-list components with specs; then `BlogSearchComponent` + route + module imports; then wire `EntriesComponent`. Run `npm test` (Karma today; Jest after that change lands).
4. **Styling pass**: `blog.scss` additions; manual review at desktop + 375px width.
5. **Generators & docs**: confirm `--check` passes for sitemap/RSS/prerender (no writes expected); regenerate nothing unless a `--check` fails; update `AGENTS.md` + `MEMORANDUM.md`.
6. **Verify**: `npm run lint && npm test && npm run build`; manual pass on both placements (see tasks 7).
7. **Rollback**: the change is additive (new files + small edits to two components, one module, one SCSS file, two docs); reverting the PR restores the exact prior behaviour. No data, schema, or generated-file changes.

## Open Questions

- **Sort control**: the URL contract reserves `sort=newest|oldest` (D4) but the UI ships with newest-only to keep the filter block to three controls. Add a 2-option sort `<select>` later if wanted — zero contract change. (Default in this plan: ship without it.)
- **Category chips UI**: if the native `<select multiple>` is rejected in visual review, the follow-up is a lightweight chip/toggle-button list built on the same `BlogSearchOptions` — the model and URL contract are unaffected.
- **`/blog/search` in the sitemap**: permanently excluded (design decision). If SEO value is ever claimed for the page itself, the follow-up is a generator change (exclude list) plus the `blogEntries`-style entry — tracked as a follow-up, not this change.
