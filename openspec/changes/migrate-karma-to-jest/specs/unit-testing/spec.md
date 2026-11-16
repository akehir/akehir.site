# Spec Delta

## Purpose

Defines how the akehir.site unit test suite is executed: the test runner and environment, test discovery, developer and CI entry points, and coverage — keeping unit tests fast, headless, and reproducible without a browser.

## ADDED Requirements

### Requirement: Headless unit test execution

The project's unit tests SHALL be executed by a Node-based test runner (Jest) in a simulated DOM (jsdom) environment, without launching a browser process.

#### Scenario: Running the suite locally

- **WHEN** a developer runs `npm test` in a clean checkout after `npm ci`
- **THEN** the full unit test suite runs to completion inside Node without any browser binary and exits with code 0 when all tests pass

#### Scenario: Running without a browser installed

- **WHEN** the unit test suite is executed in a CI environment that provides only a Node.js runtime and no Chrome/Chromium binary
- **THEN** all unit tests are discovered and executed successfully

### Requirement: Existing suite parity

The migration SHALL keep every existing unit test passing without modifying spec file code; only the execution environment changes.

#### Scenario: Unchanged specs pass

- **WHEN** `npm test` is executed after the migration
- **THEN** every `describe`/`it` block present in the spec files at migration time passes with its original assertions

#### Scenario: Zoneless change detection in tests

- **WHEN** a spec configures `TestBed` with zoneless change detection, matching the application runtime
- **THEN** the test executes without requiring Zone.js to be installed

### Requirement: Test discovery

The test run SHALL discover all spec files under `src` matching `**/*.spec.ts` and no non-spec source file.

#### Scenario: Full discovery

- **WHEN** `npm test` is executed
- **THEN** every `*.spec.ts` file under `src/` is executed and the reported test counts match the number of `it` blocks across those files

#### Scenario: Non-spec files are ignored

- **WHEN** a non-spec TypeScript file is added under `src/`
- **THEN** it is not executed as part of the unit test suite

### Requirement: Module resolution parity

The unit test environment SHALL resolve the project's TypeScript path aliases (`@core/*`, `@util`) and the raw Markdown import convention (`*.md?raw`) identically to the application build.

#### Scenario: Path alias resolution

- **WHEN** a spec imports a module via the `@core/...` or `@util` alias
- **THEN** the import resolves to the corresponding file under `src/app/core/`

#### Scenario: Raw Markdown import

- **WHEN** a module under test imports a Markdown asset using the `?raw` suffix
- **THEN** the import resolves to the file's string content

### Requirement: Developer and CI entry points

The project SHALL expose `npm test` as the canonical non-interactive unit test entry point for local development and CI, plus dedicated scripts for CI runs and coverage.

#### Scenario: Local and CI run

- **WHEN** `npm test` (locally) or the CI test script (in the pipeline) is executed
- **THEN** the run is non-interactive (no watch mode by default), fails the build with a non-zero exit code when any test fails, and passes silently when all tests pass

#### Scenario: Coverage run

- **WHEN** the coverage script is executed
- **THEN** coverage is collected for `src/` source files, a text summary is printed, and an HTML report is written to the git-ignored `coverage/` directory

### Requirement: CI integration

The CI `build` stage SHALL run the unit test suite via the npm test entry point, and the unit test step SHALL NOT require a browser binary in the pipeline image.

#### Scenario: CI pipeline test step

- **WHEN** the CI `build` stage runs for a supported branch or merge request
- **THEN** unit tests run as part of the stage before the production build and the stage fails if any unit test fails

#### Scenario: No browser dependency for unit tests

- **WHEN** the CI pipeline runs the unit test step
- **THEN** no Chrome/Chromium installation, launcher configuration, or browser flags are consulted
