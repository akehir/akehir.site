# Spec Delta

## Purpose

Defines how the akehir.site blog can be searched and filtered: the title-only matching semantics, the category and publication-date filters, the shared filter UI and results list, their two placements (integrated on `/blog` and the dedicated `/blog/search` page), the shareable URL parameter contract of the search page, and the generated-file (sitemap/RSS/prerender) contract that the feature must not break.

## ADDED Requirements

### Requirement: Title search

The blog search SHALL match the free-text query against blog entry titles only, and SHALL NOT match post bodies or any other field. Matching SHALL be case-insensitive and diacritic-insensitive. A query containing multiple whitespace-separated words SHALL match an entry only if every word matches (logical AND). An empty query SHALL not filter.

#### Scenario: Case- and diacritic-insensitive match

- **WHEN** the query is `traefik` and an entry title is `Debugging Kubernetes Traefik Ingress Issues by Reading the Traefik Logs`
- **THEN** the entry matches, and the match is unchanged for `TRAEFIK` or a diacritic-variant query (e.g. `traéfik` also matches `Traefik`, as verified by a unit test on synthetic entries)

#### Scenario: Multi-word query uses AND semantics

- **WHEN** the query is `wireguard docker`
- **THEN** only entries whose title contains both `wireguard` and `docker` (case-insensitive) are returned; entries containing only one of the two words are not returned

#### Scenario: No match yields the empty state, not an error

- **WHEN** the query has no matching entry title
- **THEN** the results area shows the empty state (see "Results list and empty state") and no error is raised

#### Scenario: Body text is not searched

- **WHEN** a word appears only in an entry's Markdown body and not in its title
- **THEN** the entry is not returned for that word

### Requirement: Category filter

The category filter SHALL offer exactly the categories that occur in the `categories` arrays of the visible (non-hidden) blog entries, each with the number of visible entries carrying it, in alphabetical order. Categories declared in the `EntryCategory` type but unused by any entry SHALL NOT be offered. Selecting one or more categories SHALL return only entries that carry **all** selected categories (logical AND). The filter SHALL support multiple simultaneous selections.

#### Scenario: Options are derived from the corpus

- **WHEN** the filter UI is rendered
- **THEN** the category choices are exactly the union of the visible entries' `categories` arrays (15 categories in the current corpus) with per-category counts, sorted alphabetically, and do not include unused `EntryCategory` values such as `Android`, `Travel`, or `Reading`

#### Scenario: Multi-select uses AND semantics

- **WHEN** the user selects `Self-Hosting` and `Docker`
- **THEN** only entries whose `categories` contain both `Self-Hosting` and `Docker` are returned

#### Scenario: Unselecting restores

- **WHEN** the user removes all category selections
- **THEN** the category criterion no longer filters, and the remaining criteria (query, date range) alone determine the results

### Requirement: Date range filter

The date filter SHALL consist of two independent, optional bounds — `from` and `to` — at day granularity over each entry's `publishedDate`. Both bounds SHALL be inclusive. Bounds SHALL be validated as `YYYY-MM-DD`; invalid or missing values SHALL be treated as unset. When `from` is later than `to`, the bounds SHALL be swapped rather than producing an error.

#### Scenario: Inclusive range

- **WHEN** `from` is `2025-01-01` and `to` is `2025-12-31`
- **THEN** entries published on `2025-01-01` and `2025-12-31` are included, and entries published `2024-12-31` or `2026-01-01` are not

#### Scenario: Single bound

- **WHEN** only `from` is set to `2026-01-01`
- **THEN** all entries published on or after that date are returned regardless of `to`

#### Scenario: Invalid date value

- **WHEN** a bound does not match `YYYY-MM-DD` (e.g. `2026/01/01` or a partial value)
- **THEN** that bound is ignored and the filter behaves as if it were unset

#### Scenario: Reversed bounds

- **WHEN** `from` is `2026-06-01` and `to` is `2025-01-01`
- **THEN** the bounds are treated as `from` `2025-01-01`, `to` `2026-06-01` and the results reflect that swapped range

### Requirement: Shared filter UI

One reusable filter component SHALL provide the query field, the category multi-select, and the from/to date inputs, and SHALL be used by both placements (the `/blog` list and the `/blog/search` page) without modification of its behaviour. The component SHALL be presentation/state-bound only: it emits criteria changes and SHALL not navigate or write URLs itself. Text input SHALL be debounced (250 ms); category and date changes SHALL apply immediately.

#### Scenario: Debounced text input

- **WHEN** the user types into the query field
- **THEN** results update at most once per 250 ms of inactivity, and pressing Enter in the field applies the current text immediately

#### Scenario: Escape clears the query

- **WHEN** the user presses Escape in the query field
- **THEN** the query is cleared and results reflect the remaining criteria

#### Scenario: Single component, two placements

- **WHEN** the filter UI is rendered on `/blog` and on `/blog/search`
- **THEN** both render the same component with identical controls, labels, and interaction semantics

#### Scenario: Component does not navigate

- **WHEN** a filter control is changed
- **THEN** the component emits the updated criteria and performs no routing; any URL update is performed by the embedding page

### Requirement: Integrated filters on the /blog list

The `/blog` entries page SHALL embed the filter UI above the entries list. With no criterion active, the rendered page SHALL be identical to the current list (all visible entries, newest first, same styling, RSS link). With at least one criterion active, the list SHALL show only the matching entries, a result count, and a link to the dedicated search page carrying the current criteria.

#### Scenario: Default view unchanged

- **WHEN** `/blog` is opened with no criteria set
- **THEN** the filter UI is shown but inert, and the list renders exactly the visible entries in newest-first order as it does today

#### Scenario: Filtering narrows the visible list

- **WHEN** the user types `kubernetes` in the integrated filter
- **THEN** the list shows only matching entries with a result count, instead of the full list

#### Scenario: Search link carries the state

- **WHEN** at least one criterion is active on `/blog` and the user clicks the search-page link
- **THEN** the browser navigates to `/blog/search` with the current criteria encoded as query parameters, and the search page opens with exactly those results

#### Scenario: Clearing restores the full list

- **WHEN** the user clears all criteria on `/blog`
- **THEN** the full newest-first list is shown again and the search-page link disappears

### Requirement: Dedicated search page

A route `/blog/search` SHALL render the filter UI and the results list, with the URL query string as the single source of truth for the criteria. Criteria SHALL be read from the parameters on navigation and written back on every applied change. Only non-default criterion values SHALL be present in the URL. The page SHALL NOT be linked from the site navigation.

#### Scenario: URL parameters

- **WHEN** the page URL is `/blog/search?q=wireguard&categories=Self-Hosting,Docker&from=2025-01-01&to=2026-01-01&sort=oldest`
- **THEN** the filter controls are restored to exactly those values and the results reflect all of them, ordered oldest-first

#### Scenario: Minimal URL for defaults

- **WHEN** no criterion is set on the search page
- **THEN** the URL contains no query parameters (it is exactly `/blog/search`)

#### Scenario: Controls sync to the URL

- **WHEN** the user changes a criterion on the search page
- **THEN** the URL query string is updated (merging with existing parameters, removing parameters whose value returns to the default) and the results update

#### Scenario: Shareable state

- **WHEN** a user opens a `/blog/search` URL shared by another user
- **THEN** the search page renders the same criteria and results without any prior interaction

#### Scenario: No navigation entry

- **WHEN** the site navigation is opened
- **THEN** it contains no link to `/blog/search`

### Requirement: Results list and empty state

Both placements SHALL render results through one shared results component showing, for each result: the entry title (link, styled identically to the existing `/blog` list items), the publication date, and — when a category filter is active — the entry's categories that caused the match. The list SHALL show a count of matching entries over the total visible entries. When no entry matches, the list SHALL show an empty state with a "Clear search" action that resets all criteria.

#### Scenario: Result row content

- **WHEN** a category filter is active and an entry matches
- **THEN** the row shows the entry title (link), its publication date, and the matching categories

#### Scenario: Count

- **WHEN** 12 of the 43 visible entries match the active criteria
- **THEN** the results area shows a "12 of 43"-style count

#### Scenario: Empty state with recovery

- **WHEN** no entry matches the active criteria
- **THEN** an empty state is shown with a "Clear search" control, and activating it resets all criteria and restores the full results

### Requirement: Visibility and ordering

Search and filtering SHALL operate on the same visible-entry set as the blog list and the RSS feed: entries with `hidden: true` SHALL NEVER appear in results, regardless of criteria. Results SHALL be ordered newest-first by `publishedDate` by default; the `sort=oldest` parameter value SHALL reverse that order.

#### Scenario: Hidden entries are excluded

- **WHEN** a query or filter would match an entry marked `hidden: true`
- **THEN** that entry is not returned in any placement

#### Scenario: Default ordering

- **WHEN** results are rendered without a `sort` parameter
- **THEN** they are ordered by `publishedDate` descending (newest first), matching the existing `/blog` list ordering

#### Scenario: Explicit oldest ordering

- **WHEN** the `sort` parameter is `oldest`
- **THEN** results are ordered by `publishedDate` ascending

### Requirement: Generated-file contract

The feature SHALL leave `src/assets/sitemap.xml` and `src/assets/rss.xml` byte-identical (verified by the generators' `--check` modes) and SHALL NOT add `/blog/search` to the sitemap. The prerender route file SHALL not change (the new route is a child route inside the blog module, which the prerender generator does not parse).

#### Scenario: Sitemap unchanged and cross-check green

- **WHEN** `node tools/generate-sitemap.mjs --check` and `node tools/generate-rss-feed.mjs --check` are run after the feature lands
- **THEN** both exit 0 without modifying any file, and `https://akehir.com/blog/search` is not present in `src/assets/sitemap.xml`

#### Scenario: Prerender route file unchanged

- **WHEN** `node tools/generate-prerender-routes.mjs --check` is run after the route is added
- **THEN** it exits 0 and `src/prerender-routes.txt` does not gain a `/blog/search` line

### Requirement: Test coverage

The search model (query matching, category/date filtering, URL (de)serialization, options derivation, ordering, hidden-entry exclusion) SHALL be covered by unit tests over the pure functions. The filter component and the search page SHALL have component specs following the existing zoneless `TestBed` pattern. The whole suite SHALL pass on the current Karma runner and on the Jest migration as it lands.

#### Scenario: Model behaviour is tested

- **WHEN** `npm test` runs
- **THEN** tests cover at minimum: AND multi-word matching, diacritic folding, empty query, category AND semantics, date-bound inclusivity and invalid handling, bound swapping, param serialization round-trip (write then parse equals the original non-default criteria), options derivation (no unused categories, counts correct), hidden-entry exclusion, and newest/oldest ordering

#### Scenario: Component specs

- **WHEN** `npm test` runs
- **THEN** component specs verify the filter component emits debounced criteria and that the search page restores criteria from `queryParams` and syncs changes back
