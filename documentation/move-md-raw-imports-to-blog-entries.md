# Move build-time markdown raw imports into `blogEntries`

Status: done (shipped in the commit following `617b301`)
Branch: `feat/angular-ssg`
Date: 2026-09-06

## Context

`@angular/ssg` prerendering renders each blog page statically (for SEO), but
ngx-markdown's `[src]` input fetches the `.md` file over HTTP at runtime —
that fetch never resolves during prerendering, so the static HTML only
contained the projected `<h1>` and the "Published:" line, not the article
body.

The fix (commit `1a3f620`, since **reverted**) was to import each `.md` file
at build time (`?raw` + esbuild `loader: { ".md": "text" }`) and pass the
string synchronously into ngx-markdown's `[data]` input. The approach itself
is correct and stays. What we change is _where_ the raw import lives:

- **Before (reverted):** every one of the 35 entry components
  (`src/app/pages/blog/entries/<year>/<slug>.component.ts`) raw-imported its
  own markdown and passed it via a `[markdown]` input down the component
  tree.
- **After (this plan):** the raw imports live in `blogEntries`
  (`src/app/pages/blog/blog.module.ts`) as part of the route `data`, next to
  `title`, `content`, `source`, … The components access the markdown through
  the `ActivatedRoute` data, exactly like all the other attributes.

## Goals

1. Revert commit `1a3f620` (raw imports in the entry components).
2. Re-implement the prerendered-content fix with the raw imports declared in
   `blogEntries`, exposed as a new `contentRaw` route-data attribute.
3. Keep the build/test/loader/type-declaration pieces that make `?raw`
   markdown imports work.
4. Keep the documented behavior: prerendered blog pages contain the full
   article body; `lint` and unit tests pass.

## Design

### Data model (`blog.module.ts`)

- `BlogData` gains an optional field:

  ```ts
  contentRaw?: string; // full markdown content, inlined at build time
  ```

  It is optional because the hidden draft
  `cool-things-with-transformers-in-the-browser` has no `content` path.

- One raw import per entry that has a `content` path (35 entries), placed at
  the top of `blog.module.ts`. Import identifier convention:
  `rawMarkdown_` + route path with `-` and `.` replaced by `_`, e.g.:

  ```ts
  import rawMarkdown_init_7 from '../../../assets/blog/2026/init-7.md?raw';
  ```

  The relative path is derived from the existing `content` value
  (`/assets/blog/<year>/<slug>.md` → `../../../assets/blog/<year>/<slug>.md`,
  relative to `src/app/pages/blog/`), so `contentRaw` can never drift from
  `content`.

- Each entry's `data` object gains `contentRaw: rawMarkdown_<path>`.

Note: two entries have line-wrapped `content` literals
(`llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models`,
`https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak`);
their markdown files match their `content` paths 1:1 — verified before
writing the imports.

### Components

- `blog-entry-container.component.ts`
  - Adds `contentRaw = computed(() => this.#data()?.contentRaw ?? '')`.
  - Binds it on `BlogEntryComponent`: `[contentRaw]="contentRaw()"`.
  - No `input` is needed here anymore — the value comes from the route data
    like `title`, `src`, `sourceLink`, `publishedDate`.
- `blog-entry.component.ts`
  - Adds `contentRaw = input<string>('')` (defaults to empty, so entries
    without a `contentRaw` — the hidden draft — keep working).
  - Template:
    `<markdown (ready)="onMarkdownReady()" [data]="contentRaw() || null" [src]="contentRaw() ? null : src()">`
    i.e. `[data]` whenever raw content is available (SSR/prerender-safe),
    `[src]` only as fallback for entries without raw content.
  - The existing `markdown = viewChild(MarkdownComponent)` keeps its name
    (no collision anymore, since the input is called `contentRaw`).
- Entry components (`entries/<year>/*.component.ts`) stay in their original,
  reverted state: `<ake-blog-entry-container>` with no bindings. Nothing to
  change per entry — that is the whole point.

### Build configuration (re-introduced from the reverted commit)

- `angular.json`: `"loader": { ".md": "text" }` on the `build` and `test`
  targets, so esbuild inlines the `?raw` `.md` imports as strings.
- `src/types/raw-imports.d.ts`: `declare module '*.md?raw'` (default export
  `string`).

### Docs (`AGENTS.md`)

- Keep the "Add Prerender Route" step (routes must be in
  `prerender-routes.txt` to be prerendered).
- Update the build-time-markdown note: the raw import now lives in
  `blogEntries` (`contentRaw` in the route `data`), not in the entry
  component; new posts need the import + `contentRaw` in the `data` object
  and the route in `prerender-routes.txt`. Keep the warning against
  `[src]` for article content.

## Steps

1. **Revert** — `git revert 1a3f620` (done, commit `617b301`).
2. **Plan** — this file, committed with the implementation.
3. **`blog.module.ts`** — add `contentRaw?: string` to `BlogData`; add the 35
   `?raw` imports; set `contentRaw` in every entry's `data`.
4. **Components** — container: computed + binding; entry: `contentRaw`
   input + `[data]`/`[src]` template change.
5. **Build config** — `angular.json` loaders + `src/types/raw-imports.d.ts`.
6. **Docs** — `AGENTS.md` adjustments.
7. **Verify**
   - `npm run lint` (prettier + eslint)
   - `npm test` (unit tests, CI runs `test:docker`)
   - `npm run build` — production build prerenders all routes; assert the
     prerendered HTML contains full article bodies (grep a known sentence in
     `dist/akehir/browser/blog/<slug>.html` for a couple of entries, incl.
     2007 `hello-world` and a 2026 one), and that the hidden draft page
     still prerenders without errors.
8. **Commit** — single commit, e.g.
   "Move raw markdown imports into blogEntries route data".

## Trade-offs / notes

- **Bundle size:** the blog module is lazy-loaded
  (`loadChildren` in `app-routing.module.ts`), so all inlined markdown lands
  in the blog chunk, not the main bundle. With the reverted approach the
  markdown was split across per-entry chunks (loaded only when opening that
  entry); now the whole blog chunk (incl. all articles) is loaded when
  navigating to `/blog` at all. Net article text volume is the same, the
  listing page just ships more. Accepted for code clarity, per the request.
- `content` (the `/assets/...` URL) is kept: it is still the `[src]`
  fallback for entries without raw content and documents where the file
  lives.
- Alternative considered: a separate `blog-content.ts` mapping slug → raw
  content, imported by `blog.module.ts`. Rejected — the user asked for the
  raw imports directly in `blogEntries`, and a side table would just add
  indirection without removing the per-entry import lines.

## Open questions

None — the approach and naming (`contentRaw`) were agreed with the
maintainer.
