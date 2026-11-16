# Tasks

## 1. Baseline

- [ ] 1.1 Confirm the current Karma suite is green: run `ng test --no-watch` (local Chrome) and record the pass count (expected: all specs in 13 files pass); verify with a green Karma run output
- [ ] 1.2 Record the baseline spec inventory: `find src -name '*.spec.ts' | wc -l` (expected 13) and total `it(` count (`grep -rho 'it(' src --include='*.spec.ts' | wc -l`); save both numbers for the parity check in 5.2; verify output matches expectations

## 2. Jest tooling (overlap phase — Karma still intact)

- [ ] 2.1 Install dev dependencies `npm i -D jest@^30 jest-preset-angular@^17 @types/jest@^30 jest-environment-jsdom@^30 jsdom@^30` and verify `npx jest --version` prints a 30.x version and `npm ls jest jest-preset-angular` shows no peer-dependency errors
- [ ] 2.2 Create `setup-jest.ts` at the repo root calling `setupZonelessTestEnv()` from `jest-preset-angular/setup-env/zoneless` and verify the file is picked up by the spec tsconfig (`src/tsconfig.spec.json` `include` covers root via Jest config, not tsconfig — verify by running a throwaway spec in task 2.4)
- [ ] 2.3 Create `tools/jest-raw-md.cjs` — a Jest loader module that reads the Markdown file named in its resolved path and `module.exports` the file's string content as default export (for the `*.md?raw` mapper target) and verify `node -e "const m = require('./tools/jest-raw-md.cjs'); console.log(typeof m)"` runs without error
- [ ] 2.4 Create root `jest.config.cjs` using `createCjsPreset()` from `jest-preset-angular/presets` with: `setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']`, `testMatch: ['<rootDir>/src/**/*.spec.ts']`, `moduleNameMapper` for `^@core/(.*)$` → `<rootDir>/src/app/core/$1`, `^@util$` → `<rootDir>/src/app/core/utilities/index.ts`, and `^(.+\.md)\?raw$` → a helper resolving the `?raw` import to the file's content via `tools/jest-raw-md.cjs`; verify `npx jest --listTests` lists exactly the 13 spec files from task 1.2
- [ ] 2.5 Create a temporary synthetic spec `src/app/tools-raw-md.spec.ts` that imports a blog Markdown asset with `?raw` and asserts the default export is a non-empty string; run `npx jest --testPathPattern tools-raw-md` and verify it passes (proves `?raw` parity); the spec is deleted in 4.3
- [ ] 2.6 Update `src/tsconfig.spec.json`: set `compilerOptions.module` to `CommonJS`, `moduleResolution` to `node10`, `types` to `["jest", "webgl2", "node"]`, keep `include`/`outDir` and the `angularCompilerOptions` block; verify `npx tsc -p src/tsconfig.spec.json --noEmit` exits 0

## 3. Parity run (Karma still present)

- [ ] 3.1 Run the full Jest suite with `npx jest --watch=false` and verify all 13 spec files pass with the same `it` count as recorded in 1.2 (failures here are fixed before any Karma removal; if a spec fails on a missing DOM API, add the minimal mock in a new `jest-global-mocks.ts` imported from `setup-jest.ts` per jest-preset-angular "Global mocks" guidance)
- [ ] 3.2 Re-run the Karma baseline `ng test --no-watch` and verify it still passes unmodified (proves the overlap phase changed no spec behavior)

## 4. Cutover (remove Karma)

- [ ] 4.1 Delete `src/test.ts` and `src/karma.conf.js` and verify `git status` shows both deletions and nothing else references them (`grep -rn "karma" angular.json src package.json || echo clean`)
- [ ] 4.2 Update `package.json`: `"test": "jest --watch=false"`, add `"test:watch": "jest --watch"` and `"test:coverage": "jest --coverage --collectCoverageFrom='src/**/*.ts' --collectCoverageFrom='!src/**/*.spec.ts' --collectCoverageFrom='!src/main.ts' --collectCoverageFrom='!src/main.server.ts' --collectCoverageFrom='!src/environments/**'"` (html + text-summary reporters into git-ignored `coverage/`); remove `test:docker`; and verify `npm test` runs the full Jest suite one-shot and exits 0
- [ ] 4.3 Delete the temporary `src/app/tools-raw-md.spec.ts` from 2.5 and re-run `npm test` to verify the suite stays green at the 13-file inventory
- [ ] 4.4 Remove the `test` architect target (builder `@angular/build:karma`) from `angular.json` and verify `npx ng test` now fails with "target not found" (expected) while `npm test` still works
- [ ] 4.5 Remove dev dependencies `karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core jasmine-spec-reporter istanbul-lib-instrument @types/jasmine @types/jasminewd2` (`npm rm -D ...`) and verify `npm ls karma jasmine` reports them absent and `npm test` is still green
- [ ] 4.6 Patch `e2e/tsconfig.e2e.json` `types` from `["jasmine", "jasminewd2", "node"]` to `["node"]` and verify `npx tsc -p e2e/tsconfig.e2e.json --noEmit` exits 0 (e2e suite stays untouched otherwise)

## 5. CI

- [ ] 5.1 Update `.gitlab-ci.yml` `build` job script: replace `npm run test:docker` with `npm test`; extend the `changes:` lists of both branch rules and the merge-request rule with `package-lock.json`, `jest.config.cjs`, `setup-jest.ts`; and verify the resulting file passes `yamllint .` (same checks CI runs in `linty`)
- [ ] 5.2 Verify parity numbers hold after cutover: `npm test` passes with the exact `it` count from task 1.2 and `npx jest --listTests` lists exactly 13 files

## 6. Docs & quality

- [ ] 6.1 Update `README.md` "Testing & Quality" section: document `npm test` (Jest, one-shot), `npm run test:watch`, `npm run test:coverage`, and note unit tests no longer need a browser; verify the documented commands run exactly as written
- [ ] 6.2 Update `AGENTS.md` "Common Commands" table: keep `npm test` → "Runs unit tests (Jest)" and note the Jest/jsdom runner; verify the table renders and matches `package.json` scripts
- [ ] 6.3 Run `npm run lint` (prettier + eslint) and fix any formatting in new/changed files (`npm run lint:fix` if needed); verify `npm run lint` exits 0
- [ ] 6.4 Run `npm run build` and verify the production build still succeeds (ensures `tsconfig.spec.json` retargeting and removed deps have no effect on the app build)
- [ ] 6.5 Final full verification in one pass: `npm run lint && npm test && npm run build` all green; verify `coverage/` is produced by `npm run test:coverage` and is git-ignored (`git check-ignore coverage/`)

## Workflow follow-up

- Archive the change with `/opsx-archive` once the MR is merged (delta spec `unit-testing` syncs into `openspec/specs/unit-testing/`).
- Optional follow-up (separate change, infra-owned): slim the CI image from `node-with-chrome` to plain Node for the `build`/`scan-npm` stages now that unit tests are browser-free.
- Optional follow-up (separate change): remove the dead Protractor `e2e/` directory and the `e2e` npm script.
