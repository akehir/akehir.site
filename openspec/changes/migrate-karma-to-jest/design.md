# Design

## Context

Current state (verified against the repo):

- Angular 22.1.6 application (`@angular/build:application` builder), **zoneless** — `polyfills: []`, no `zone.js` in `package.json`, every spec passes `provideZonelessChangeDetection()` (26 occurrences).
- Unit tests: 13 spec files (~417 lines) under `src/`, all "should create"-style `TestBed` specs using `TestBed`, `ComponentFixture`, `provideRouter`, `provideZonelessChangeDetection`. No `jasmine.*` namespace APIs, no `spyOn`/`fakeAsync`/`flush`, no direct DOM API usage (`document.*`, `window.*`, `getComputedStyle`, observers).
- Karma chain: `@angular/build:karma` target in `angular.json` → `src/test.ts` bootstrap (`initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), { teardown: { destroyAfterEach: false } })`) → `src/karma.conf.js` (Chrome + `ChromeDocker` headless launcher, `karma-coverage` html/text-summary into `coverage/`).
- `src/tsconfig.spec.json` extends root `tsconfig.json` (`module: "preserve"`, `target: ES2022`), `types: ["jasmine", "webgl2", "node"]`, includes `**/*.spec.ts` + `**/*.d.ts`.
- Path aliases in root `tsconfig.json`: `@core/*` → `./src/app/core/*`, `@util` → `./src/app/core/utilities/index.ts`.
- Raw Markdown imports: `src/app/pages/blog/blog.module.ts` imports `*.md?raw` assets, declared in `src/types/raw-imports.d.ts` (`declare module '*.md?raw'`).
- CI: `.gitlab-ci.yml` `build` stage runs `npm run lint && npm run test:docker && npm run build` in `registry.akehir.com:443/infra/node-with-chrome/node-with-chrome`.
- Node v26.8.1 / npm 11.19.0 locally (`.nvmrc`: `lts/krypton`); 955 GB free disk for verification.

Constraint from `@angular/build` v22: the in-tree `@angular/build:unit-test` builder supports only `runner: "karma" | "vitest"` — Jest is not a supported runner in the Angular CLI, so the migration uses standalone Jest with `jest-preset-angular`.

## Goals / Non-Goals

**Goals:**

- Run the identical 13-spec suite under Jest (Jasmine-compatible globals) in a headless jsdom environment.
- Keep `npm test` as the canonical non-interactive entry point (local + CI).
- Remove the browser requirement from the unit-test path (CI image can be plain Node).
- Keep coverage available (Jest) with the same output location (`coverage/`, already git-ignored).
- Zero changes to spec file contents unless verification forces otherwise.

**Non-Goals:**

- e2e suite (`e2e/` Protractor setup) — untouched; `@types/jasminewd2` removal is handled carefully (see D7).
- Switching to Vitest (the Angular-native alternative) — out of scope; user asked for Jest.
- Adding new tests, coverage thresholds, or snapshot testing.
- Refactoring spec style (e.g., `TestBed` → standalone helpers) — only environment changes.
- Changing CI deploy/scan stages or the production build.

## Decisions

### D1: Standalone Jest + jest-preset-angular (not `@angular/build:unit-test`)

The Angular 22 `unit-test` builder's `runner` option is an enum of `karma | vitest` (verified in `node_modules/@angular/build/src/builders/unit-test/schema.json`). Jest support requires the community-maintained `jest-preset-angular` stack.

- **Choice**: `jest@^30`, `jest-preset-angular@^17` (peer deps verified compatible: `@angular/core >=20 <23`, `jest ^30`, `typescript >=5.8`, `jsdom >=26`), `@types/jest@^30`, `jest-environment-jsdom@^30`, `jsdom@^30`.
- **Alternative considered**: keep `@angular/build:unit-test` with `runner: "karma"` — rejected, that is still Karma; `runner: "vitest"` — rejected, user explicitly requested Jest.
- Consequence: tests run outside `ng test`; the `angular.json` `test` target is removed. `npm test` becomes a plain `jest` invocation.

### D2: Zoneless preset setup — `setupZonelessTestEnv()`

The app is zoneless (no `zone.js` installed). The zone-based setup (`jest-preset-angular/setup-env/zone`) pulls in Zone.js expectations the app does not use.

- **Choice**: `setup-jest.ts` calls `setupZonelessTestEnv()` from `jest-preset-angular/setup-env/zoneless`. Verified in the shipped v17 package: it initializes `getTestBed().initTestEnvironment([BrowserTestingModule, provideZonelessConfig()], platformBrowserTesting([COMPILER_OPTIONS]), ...)` with a strict `ErrorHandler`, replacing the hand-rolled `src/test.ts` bootstrap (which also used `{ teardown: { destroyAfterEach: false } }` — acceptable default difference since no spec relies on cross-test state).
- `src/test.ts` is deleted; it was only a Karma bootstrap. (The jest-preset-angular docs note that Karma's `src/test.ts` is otherwise picked up by Jest discovery — deletion is the cleanest removal; `testMatch: ['**/*.spec.ts']` already excludes it.)

### D3: CJS Jest config (`jest.config.cjs`), not ESM

- Root `tsconfig.json` uses `module: "preserve"`; Jest 30 CJS mode + ts-jest CJS transform is the well-trodden path (per jest-preset-angular's "Setup file CJS" track, matching Node < 22.18 style config; on Node 26 the CJS track still works and avoids `--experimental-vm-modules`).
- **Choice**: root `jest.config.cjs` using `createCjsPreset()` from `jest-preset-angular/presets`:
  - `setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']`
  - `testMatch: ['<rootDir>/src/**/*.spec.ts']`
  - `moduleNameMapper`: `'^@core/(.*)$' → '<rootDir>/src/app/core/$1'`, `'^@util$' → '<rootDir>/src/app/core/utilities/index.ts'`, and `^(.+\.md)\?raw$` → a tiny `tools/jest-raw-md.cjs` loader that reads the file and default-exports its content (Jest `transform` can't apply to `.md` via `?raw`; a mapper + loader module is the robust route).
  - `transform`: `^.+\\.m?[t]s$` → `jest-preset-angular` (ng-jest transformer) with `tsconfig: 'src/tsconfig.spec.json'`.
  - `testEnvironment` comes from the preset (JSDOM via `jest-environment-jsdom`).
- **Alternative considered**: ESM preset (`createEsmPreset` + `node --experimental-vm-modules`). Rejected: more moving parts (experimental flag in every script/CI), no benefit for this codebase.

### D4: `src/tsconfig.spec.json` re-targeted for ts-jest

- `module: "CommonJS"` (ts-jest CJS mode requirement; overrides the root `preserve`), `moduleResolution: "node10"` for reliable CJS resolution of `node_modules` under ts-jest, `types: ["jest", "webgl2", "node"]` (Jest globals replace `jasmine`; `webgl2` and `node` kept), `isolatedModules` inherited, `include` unchanged (`**/*.spec.ts`, `**/*.d.ts` — keeps `raw-imports.d.ts` and `node_modules/@types` out of the app build).
- `isolatedModules: true` (inherited) + ts-jest is fine because specs contain no TS features that need full program information; `diagnostics` stay enabled by default to catch spec type errors at test time (parity with Karma's AOT-compiled build).

### D5: Scripts and CI

- `package.json`:
  - `"test": "jest --watch=false"` — one-shot run, matching the old `ng test --no-watch` semantics and the spec's "non-interactive entry point" requirement (Jest would otherwise watch in an interactive TTY). Interactive dev uses `"test:watch": "jest --watch"`.
  - `"test:coverage": "jest --coverage --coverageReporters=text-summary --coverageReporters=html --collectCoverageFrom='src/**/*.ts' --collectCoverageFrom='!src/**/*.spec.ts' --collectCoverageFrom='!src/main.ts' --collectCoverageFrom='!src/main.server.ts' --collectCoverageFrom='!src/environments/**'"` — html output lands in `coverage/` (default), already git-ignored.
  - Replace `"test:docker": "jest"` (kept for CI compatibility until `.gitlab-ci.yml` is updated; dropped in the same PR as the CI edit — final state: `test:docker` removed, CI calls `npm test`).
  - `"e2e"` script: unchanged.
- `.gitlab-ci.yml` `build` job: `npm run test:docker` → `npm test`. Image `node-with-chrome` retained **for this PR** (the build still needs Chrome for nothing else, but image changes are infra-owned — see R1); note in the MR that `scan-npm`/`build` could move to a plain node image in a follow-up infra change. `rules` change-lists extended with `jest.config.cjs`, `setup-jest.ts`, `package-lock.json` so the pipeline triggers on them.

### D6: Dependency removal

Remove from `devDependencies` after green run: `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `jasmine-core`, `jasmine-spec-reporter`, `istanbul-lib-instrument`, `@types/jasmine`.

- `@types/jasminewd2`: referenced only by `e2e/tsconfig.e2e.json` (`types: ["jasmine", "jasminewd2", "node"]`). The e2e Protractor suite is already dead weight (Protractor is unmaintained, `e2e/` has no `ng e2e` target wired in `angular.json`), but this change does not delete it. **Choice**: drop `@types/jasminewd2` **and** patch `e2e/tsconfig.e2e.json` to `types: ["node"]` (jasmine types no longer exist). `npm run e2e` (`ng e2e`) was non-functional in `angular.json` (no `e2e` architect target), so this changes nothing executable. If the e2e dir is ever revived, Protractor types get re-added then.
- `ts-node` retained (no current consumer found, but harmless; removing is a separate cleanup — flagged in tasks as optional).
- `npm prune`/`npm install` regenerates `package-lock.json`.

### D7: `angular.json` test target

- **Choice**: delete the `test` architect target (builder `@angular/build:karma`) entirely. Rationale: keeping a broken Karma target invites accidental `ng test`; the unit test capability is now owned by Jest at the root. `ng` no longer knows about unit tests — `npm test` is the only entry point (documented).
- **Alternative considered**: keep target with builder `@angular/build:unit-test` + `runner: "karma"` as a transitional no-op — rejected as confusing dead config.

### D8: jsdom gaps (WebGL)

`BackgroundComponent` specs and others don't touch WebGL; the only template that would instantiate a WebGL canvas (`app.component.html` `<webgl-fluid-simulation>`) is guarded by `@if (background.active && isBrowser)` with `BackgroundService.active = false` by default, so the fluid simulation component is never created in tests.

- **Fallback (only if a test hits a missing DOM API)**: add a `jest-global-mocks.ts` (per jest-preset-angular "Customizing → Global mocks") imported from `setup-jest.ts`. Not added preemptively.

### D9: Verification-first sequencing

All 13 specs already pass under Karma (assumed green baseline). The plan runs the Jest suite **before** deleting any Karma files (overlap phase) so a regression can be attributed unambiguously:

1. Add Jest tooling + config → run `npm test` (Jest) alongside working `ng test` (Karma) → green baseline.
2. Switch scripts/CI + delete Karma files in the same change, re-run everything.

## Risks / Trade-offs

- [ts-jest + TS 6.0.3 edge case] ts-jest 29.4.x supports TS `>=5.8` per jest-preset-angular peers, but TS 6.0 is very new. → Mitigation: pin verification early (task 3 runs full suite); if ts-jest chokes, fall back to `ts-jest` `isolatedModules: true` diagnostics mode, or bump `ts-jest` if a patch releases.
- [jsdom vs real browser behavior divergence] jsdom lacks full layout/computed styles; current specs never assert styles, so risk is low. → Mitigation: spec parity requirement (all original assertions pass); future style-asserting tests may need real-browser runner — document in spec.
- [CI image mismatch] `.gitlab-ci.yml` still names `node-with-chrome` image; switching to plain node image is an infra-registry change outside this repo. → Mitigation: keep image this PR (over-provisioned but correct); add note to MR; follow-up infra ticket to slim the image.
- [`?raw` Markdown imports through jest-preset-angular's esbuild-based transformer] The ng-jest transformer is Angular AOT + esbuild-wasm; a `?raw` query suffix on an asset import may not be handled by the transformer's asset pipeline. → Mitigation: `moduleNameMapper` intercepts `^(.+\.md)\?raw$` **before** the transformer sees it, resolving to `tools/jest-raw-md.cjs` + resolved path. Verified in the overlap phase with `blog.module.ts`-adjacent specs if any exist (none import blog.module today — AppComponent spec imports `AppRoutingModule`, which only references blog.module via lazy `loadChildren` and is never eagerly imported in tests, so the `?raw` path is a latent, not active, risk; the mapper is still added for parity and is verified with a synthetic spec in task 6).
- [Watch-mode ergonomics] `npm test` is pinned to one-shot (`--watch=false`) to preserve the old `ng test --no-watch` contract; developers lose auto-watch on the default script. → Mitigation: `npm run test:watch` provides interactive watch; standard Jest UX otherwise.
- [Coverage scope drift] Karma coverage (karma-coverage, istanbul-lib-instrument) vs Jest (v8/babel) numbers differ. → Mitigation: no thresholds enforced anywhere today; coverage is informational only.

## Migration Plan

1. **Branch** off `master` (or current working branch) — single PR, two logical commits (tooling add / tooling remove).
2. **Overlap phase**: install Jest deps, add `jest.config.cjs`, `setup-jest.ts`, `tools/jest-raw-md.cjs`, retarget `tsconfig.spec.json`. Run `npm test` (Jest) → all 13 spec files green. Run `ng test --no-watch` (Karma still configured) → still green. Both green = parity achieved.
3. **Cutover**: update `package.json` scripts, delete `angular.json` test target, delete `src/test.ts`, `src/karma.conf.js`, remove Karma/Jasmine deps, patch `e2e/tsconfig.e2e.json`, update `.gitlab-ci.yml` + `rules` change lists, update `README.md`/`AGENTS.md`.
4. **Verify**: `npm run lint` (prettier checks new files), `npm test`, `npm run build` (ensures app build unaffected), `npm run lint:fix` if prettier flags formatting.
5. **Rollback**: revert the PR — everything is config/dependency-level, no application code changes; Karma baseline is intact in git history.
6. **Post-merge**: optional infra follow-up to slim the CI image; optional removal of dead `e2e/` + Protractor remnants in a separate change.

## Open Questions

- Should `npm run test:docker` be kept as a Jest alias until the CI image is slimmed, or removed immediately with the CI edit? (Default in this plan: removed with the CI edit in the same PR — it exists solely to pass `--browsers ChromeDocker` to Karma.)
- Is removing the `angular.json` `test` target acceptable to the team (vs. keeping a `unit-test`/vitest target as future fallback)? (Default: remove.)
