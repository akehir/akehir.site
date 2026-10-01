#!/usr/bin/env node
/**
 * Generates src/prerender-routes.txt for the Angular builder's
 * prerender.routesFile option (see https://angular.dev/tools/cli/build#options)
 * from the routing configuration and the data that backs the
 * parameterized routes:
 *
 * - Static pages from src/app/app-routing.module.ts
 * - All non-hidden blog entries from src/app/pages/blog/blog.module.ts
 * - All projects from src/app/core/data/ProjectList.ts
 * - All colour demo variants from src/app/core/services/colour.service.ts
 *
 * The file contains exactly one route per line, without comments or empty
 * lines: the builder reads every line of routesFile as a route.
 *
 * Usage: node tools/generate-prerender-routes.mjs
 *        node tools/generate-prerender-routes.mjs --check  (no files are written)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes('--check');

const routesPath = path.join(root, 'src/prerender-routes.txt');
const appRoutingPath = path.join(root, 'src/app/app-routing.module.ts');
const blogModulePath = path.join(root, 'src/app/pages/blog/blog.module.ts');
const projectListPath = path.join(root, 'src/app/core/data/ProjectList.ts');
const colourServicePath = path.join(
  root,
  'src/app/core/services/colour.service.ts'
);

const read = file => readFileSync(file, 'utf8');

let match;
const routes = [];

// --- Static pages from app-routing.module.ts ---
const appRouting = read(appRoutingPath);
const routesArraySource = appRouting.slice(
  appRouting.indexOf('const routes: Routes = ['),
  appRouting.indexOf('];')
);

// Finds the index of the ']' matching the '[' at openIndex.
function findClosingBracket(source, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    if (source[i] === '[') {
      depth += 1;
    } else if (source[i] === ']') {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

// Routes with a parameter, a wildcard, or an empty path are not prerendered.
function isPrerenderableRoute(routePath) {
  return routePath !== '' && !routePath.includes(':') && routePath !== '**';
}

// Collects the children blocks so their paths are prefixed with the parent
// route (e.g. /error/403) and not parsed as top-level routes.
const childrenBlocks = [];
const childrenBlockRegex = /\bchildren: \[/g;
let blockMatch;
while ((blockMatch = childrenBlockRegex.exec(routesArraySource)) !== null) {
  const openIndex = blockMatch.index + blockMatch[0].length - 1;
  const closeIndex = findClosingBracket(routesArraySource, openIndex);
  const parentMatch = [
    ...routesArraySource.slice(0, openIndex).matchAll(/path: '([^']*)'/g),
  ].pop();
  childrenBlocks.push({
    start: openIndex,
    end: closeIndex,
    parent: parentMatch ? parentMatch[1] : '',
  });
}

const findContainingBlock = index =>
  childrenBlocks.find(block => index >= block.start && index <= block.end);

const staticPathRegex = /path: '([^']*)'/g;
let pathMatch;
while ((pathMatch = staticPathRegex.exec(routesArraySource)) !== null) {
  const routePath = pathMatch[1];
  if (!isPrerenderableRoute(routePath)) {
    continue;
  }
  const block = findContainingBlock(pathMatch.index);
  routes.push(block ? `/${block.parent}/${routePath}` : `/${routePath}`);
}
routes.push('/');

// --- Blog entries from blog.module.ts ---
const blogModule = read(blogModulePath);
const entriesSource = blogModule
  .slice(
    blogModule.indexOf('export const blogEntries: BlogRoute[] = ['),
    blogModule.indexOf('const routes: Routes = [')
  )
  .replace(/\/\*.*?\*\//gs, '');
const blogEntryRegex =
  /\{\s*path:\s*'([^']+)',\s*title:[\s\S]*?data:\s*\{([\s\S]*?)\}\s*,\s*loadComponent:/g;
const blogRoutes = [];
const blogEntryPaths = new Set();
while ((match = blogEntryRegex.exec(entriesSource)) !== null) {
  const [, entryPath, dataBlock] = match;
  blogEntryPaths.add(entryPath);
  if (/hidden *: *true/.test(dataBlock)) {
    continue;
  }
  blogRoutes.push(`/blog/${entryPath}`);
}

// --- Static child pages of the blog module (e.g. /blog/search) ---
// The blog module declares child routes next to the blog entries (the entry
// list at /blog itself and the search page). Collect the child paths, skip
// the empty path (it is /blog itself) and the blog entry paths (already
// listed), leaving pages such as /blog/search.
const blogChildrenOpen = blogModule.indexOf('children: [');
const blogChildrenSource =
  blogChildrenOpen === -1
    ? ''
    : blogModule.slice(
        blogChildrenOpen,
        findClosingBracket(
          blogModule,
          blogChildrenOpen + 'children: ['.length - 1
        )
      );
const blogChildRoutes = [];
const blogChildRegex = /path: '([^']*)'/g;
let childMatch;
while ((childMatch = blogChildRegex.exec(blogChildrenSource)) !== null) {
  const childPath = childMatch[1];
  if (childPath === '' || blogEntryPaths.has(childPath)) {
    continue;
  }
  blogChildRoutes.push(`/blog/${childPath}`);
}

// --- Project IDs from ProjectList.ts ---
const projectList = read(projectListPath);
const projectIdsSource = projectList.slice(
  projectList.indexOf('export const projectList'),
  projectList.lastIndexOf('};')
);
const projectRouteRegex = /^\s*id: '([^']*)',/gm;
const projectRoutes = [];
while ((match = projectRouteRegex.exec(projectIdsSource)) !== null) {
  projectRoutes.push(`/projects/${match[1]}`);
}

// --- Colour demo variants from colour.service.ts ---
const colourService = read(colourServicePath);
const variantRegex = /variant === '([^']*)'/g;
const colourVariants = [];
while ((match = variantRegex.exec(colourService)) !== null) {
  colourVariants.push(match[1]);
}

if (
  routes.length === 0 ||
  blogRoutes.length === 0 ||
  projectRoutes.length === 0 ||
  colourVariants.length === 0
) {
  console.error('Failed to parse the route sources:');
  if (routes.length === 0) {
    console.error(
      `  - no static routes found in ${path.relative(root, appRoutingPath)}`
    );
  }
  if (blogRoutes.length === 0) {
    console.error(
      `  - no blog entries found in ${path.relative(root, blogModulePath)}`
    );
  }
  if (projectRoutes.length === 0) {
    console.error(
      `  - no projects found in ${path.relative(root, projectListPath)}`
    );
  }
  if (colourVariants.length === 0) {
    console.error(
      `  - no colour variants found in ${path.relative(root, colourServicePath)}`
    );
  }
  process.exit(1);
}

const allRoutes = [...routes, ...blogRoutes, ...blogChildRoutes, ...projectRoutes];
colourVariants.forEach(variant => allRoutes.push(`/demos/colour/${variant}`));

const output = [...new Set(allRoutes)].sort().join('\n') + '\n';

if (checkOnly) {
  const current = readFileSync(routesPath, 'utf8');
  if (current !== output) {
    console.error(
      'src/prerender-routes.txt is out of date. Re-run without --check.'
    );
    process.exit(1);
  }
  console.log('src/prerender-routes.txt is up to date.');
} else {
  writeFileSync(routesPath, output);
  console.log(
    `Wrote ${allRoutes.length} routes to src/prerender-routes.txt ` +
      `(${routes.length} static, ${blogRoutes.length} blog, ` +
      `${blogChildRoutes.length} blog pages, ${projectRoutes.length} projects, ` +
      `${colourVariants.length} colour demos).`
  );
}
