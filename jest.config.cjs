const { createCjsPreset } = require('jest-preset-angular/presets');

/**
 * Standalone Jest config for the Angular app (see openspec/changes/migrate-karma-to-jest).
 *
 * Note: options passed to `createCjsPreset` are forwarded to the
 * jest-preset-angular transformer, so Jest-level keys (setup files, module
 * mapping, test discovery) are declared at the top level of this object.
 * The `transform` map is restated here (instead of relying on the preset's)
 * so a dedicated transformer can handle the app's `*.md?raw` Markdown asset
 * imports.
 */
const config = {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  resolver: '<rootDir>/tools/jest-raw-md-resolver.cjs',
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@util$': '<rootDir>/src/app/core/utilities/index.ts',
  },
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/src/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
    // `tools/jest-raw-md-resolver.cjs` strips the `?raw` suffix; this compiles
    // the resolved `.md` file's content as the module's default export.
    '^.+\\.md$': '<rootDir>/tools/jest-raw-md.cjs',
  },
};

module.exports = config;
