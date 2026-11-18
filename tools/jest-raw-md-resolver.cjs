/**
 * Jest resolver for the app's `*.md?raw` asset imports.
 *
 * The Angular build loads these through the `.md: "text"` loader configured in
 * `angular.json`. Jest cannot resolve a module id carrying a `?raw` query
 * suffix, so this resolver strips the suffix and delegates to Jest's default
 * resolution; `tools/jest-raw-md.cjs` (the `^.+\.md$` transform in
 * `jest.config.cjs`) then compiles the file into a module whose default export
 * is its string content — the contract declared in `src/types/raw-imports.d.ts`.
 */
module.exports = (request, options) =>
  options.defaultResolver(request.replace(/\?raw$/, ''), options);
