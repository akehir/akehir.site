/**
 * Jest transformer for `*.md?raw` imports.
 *
 * `tools/jest-raw-md-resolver.cjs` strips the `?raw` query suffix (which Jest
 * cannot resolve), and this transformer then
 * compiles the resolved Markdown file's content into a CommonJS module whose
 * default export is the file's string content — the same contract the app's
 * `?raw` asset loader provides (`declare module '*.md?raw'`).
 */
const fs = require('fs');

module.exports = {
  process(sourceText, sourcePath) {
    const content = fs.existsSync(sourcePath)
      ? fs.readFileSync(sourcePath, 'utf8')
      : sourceText;

    return {
      code:
        'module.exports = { __esModule: true, default: ' +
        JSON.stringify(content) +
        ' };',
    };
  },
  getCacheKey(sourceText, sourcePath) {
    return sourcePath + ':' + fs.statSync(sourcePath).mtimeMs;
  },
};
