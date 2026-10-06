# Proposal

## Why

Unit tests currently run on Karma + Jasmine in a real Chrome browser. That forces the CI `build` stage to depend on a Chrome-based Node image (`registry.akehir.com:443/infra/node-with-chrome/node-with-chrome`), requires a custom `ChromeDocker` launcher with `--no-sandbox`, and makes local test runs slow (full browser boot, watch-mode rebuilds). Jest runs the same Jasmine-style specs in Node with a JSDOM environment — no browser, faster feedback, and a standard toolchain that matches the rest of the ecosystem.

## What Changes

- **BREAKING** (CI): the `build` pipeline job no longer needs a Chrome binary; `npm run test:docker` switches from `ng test` (Karma headless Chrome) to Jest, so the plain Node CI image becomes sufficient for the test step.
- Add Jest, `jest-preset-angular`, `@types/jest`, `jest-environment-jsdom`, and `jsdom` as dev dependencies.
- Add a root-level `jest.config.cjs` and `setup-jest.ts` (zoneless TestBed initialization via `jest-preset-angular/setup-env/zoneless`).
- Update `src/tsconfig.spec.json` for the Jest/ts-jest toolchain (`module: CommonJS`, `types: ["jest", "webgl2", "node"]`) and remove the Karma bootstrap `src/test.ts`.
- Re-point `npm test` / `npm run test:docker` in `package.json` to Jest; update `angular.json` (drop the `karma` test target, keep a `unit-test` target or none).
- Remove Karma/Jasmine tooling: `src/karma.conf.js`, `@types/jasmine`, `@types/jasminewd2`, `jasmine-core`, `jasmine-spec-reporter`, `karma*` packages, and `istanbul-lib-instrument` (coverage moves to Jest).
- Update `.gitlab-ci.yml` `build` job to run `npm test` (Jest) instead of `npm run test:docker` with a browser launcher; the e2e `protractor` config is untouched (separate concern, see Non-goals below).
- Update documentation (`README.md`, `AGENTS.md`) so `npm test` keeps its meaning.
- All 13 existing spec files must pass unchanged under Jest (only environment, not code, changes).

## Capabilities

### New Capabilities

- `unit-testing`: defines how the unit test suite is executed in this project — runner, environment, discovery, entry points, coverage, and CI integration — so the test toolchain has an owned, durable spec.

### Modified Capabilities

<!-- none: no existing capabilities/specs are tracked under openspec/specs/ -->

## Impact

- **Dependencies**: add `jest`, `jest-preset-angular`, `@types/jest`, `jest-environment-jsdom`, `jsdom`; remove `karma*`, `jasmine-core`, `jasmine-spec-reporter`, `@types/jasmine`, `@types/jasminewd2`, `istanbul-lib-instrument`.
- **Files**: `package.json`, `package-lock.json`, `angular.json`, `jest.config.cjs` (new), `setup-jest.ts` (new), `src/tsconfig.spec.json`, `src/test.ts` (deleted), `src/karma.conf.js` (deleted), `.gitlab-ci.yml`, `README.md`, `AGENTS.md`.
- **Spec files**: none expected to change (13 spec files, all use `TestBed`, `provideRouter`, `provideZonelessChangeDetection`; no `jasmine.*` namespace APIs, no direct DOM API usage).
- **CI**: build stage test step switches from Karma-in-Chrome to Jest in Node; Chrome no longer needed for unit tests (e2e, if ever re-enabled, is out of scope).
- **Local dev**: `npm test` runs headless Node tests; coverage via `npm run test:coverage` (Jest) replaces `karma-coverage` output.
