#!/usr/bin/env node
/**
 * Generates src/assets/sitemap.xml for the site from the Angular routing
 * table and the data that backs the parameterized routes (the same
 * sources as src/prerender-routes.txt):
 *
 * - / and the static pages from src/app/app-routing.module.ts,
 *   in routing-table order (including nested children)
 * - All non-hidden blog entries from src/app/pages/blog/blog.module.ts,
 *   listed after /blog with the most recently modified first
 * - All projects from src/app/core/data/ProjectList.ts,
 *   listed after /projects
 * - All colour demo variants from src/app/core/services/colour.service.ts,
 *   listed after /demos/colour
 *
 * The error routes (/error and /error/403/404/500) are part of the routing
 * table but are excluded from the sitemap: they are catch-all pages for
 * failed navigation and must not be submitted to search engines.
 *
 * Blog entries carry a <lastmod> derived from their modifiedDate
 * (publishedDate as fallback). The other routes have no date source in
 * the routing table and carry no <lastmod>.
 *
 * Usage: node tools/generate-sitemap.mjs
 *        node tools/generate-sitemap.mjs --check  (no files are written)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes('--check');

const SITE_ORIGIN = 'https://akehir.com';
const LASTMOD_TIME = 'T09:09:09+01:00';
const sitemapPath = path.join(root, 'src/assets/sitemap.xml');
const appRoutingPath = path.join(root, 'src/app/app-routing.module.ts');
const blogModulePath = path.join(root, 'src/app/pages/blog/blog.module.ts');
const projectListPath = path.join(root, 'src/app/core/data/ProjectList.ts');
const colourServicePath = path.join(
  root,
  'src/app/core/services/colour.service.ts'
);

const read = file => readFileSync(file, 'utf8');

// --- Static routes from app-routing.module.ts (in route order) ---
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

// Routes with a parameter, a wildcard, or an empty path are not listed.
// The error routes are excluded: they are catch-all pages for failed
// navigation and must not be submitted to search engines.
const staticRoutes = [];
const staticPathRegex = /path: '([^']*)'/g;
let pathMatch;
while ((pathMatch = staticPathRegex.exec(routesArraySource)) !== null) {
  const routePath = pathMatch[1];
  if (routePath === '' || routePath.includes(':') || routePath === '**') {
    continue;
  }
  const block = findContainingBlock(pathMatch.index);
  const route = block ? `/${block.parent}/${routePath}` : `/${routePath}`;
  if (route === '/error' || route.startsWith('/error/')) {
    continue;
  }
  staticRoutes.push(route);
}

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
let match;
const blogEntries = [];
while ((match = blogEntryRegex.exec(entriesSource)) !== null) {
  const [, entryPath, dataBlock] = match;
  if (/hidden *: *true/.test(dataBlock)) {
    continue;
  }
  const dateOf = field => {
    const dateMatch = new RegExp(`${field}: '([^']*)'`).exec(dataBlock);
    return dateMatch ? dateMatch[1] : '';
  };
  const lastmod = dateOf('modifiedDate') || dateOf('publishedDate');
  if (!lastmod) {
    console.error(
      `Blog entry "${entryPath}" has no modifiedDate or publishedDate.`
    );
    process.exit(1);
  }
  blogEntries.push({ path: entryPath, lastmod });
}
blogEntries.sort(
  (a, b) => b.lastmod.localeCompare(a.lastmod) || a.path.localeCompare(b.path)
);

// --- Project IDs from ProjectList.ts ---
const projectList = read(projectListPath);
const projectIdsSource = projectList.slice(
  projectList.indexOf('export const projectList'),
  projectList.lastIndexOf('};')
);
const projectRouteRegex = /^\s*id: '([^']*)',/gm;
const projectIds = [];
while ((match = projectRouteRegex.exec(projectIdsSource)) !== null) {
  projectIds.push(match[1]);
}

// --- Colour demo variants from colour.service.ts ---
const colourService = read(colourServicePath);
const variantRegex = /variant === '([^']*)'/g;
const colourVariants = [];
while ((match = variantRegex.exec(colourService)) !== null) {
  colourVariants.push(match[1]);
}

if (
  staticRoutes.length === 0 ||
  blogEntries.length === 0 ||
  projectIds.length === 0 ||
  colourVariants.length === 0
) {
  console.error('Failed to parse the route sources:');
  if (staticRoutes.length === 0) {
    console.error(
      `  - no static routes found in ${path.relative(root, appRoutingPath)}`
    );
  }
  if (blogEntries.length === 0) {
    console.error(
      `  - no blog entries found in ${path.relative(root, blogModulePath)}`
    );
  }
  if (projectIds.length === 0) {
    console.error(
      `  - no projects found in ${path.relative(root, projectListPath)}`
    );
  }
  if (colourVariants.length === 0) {
    console.error(
      `  - no colour variants found in ${path.relative(
        root,
        colourServicePath
      )}`
    );
  }
  process.exit(1);
}

// Top-level pages and blog entries: 1.0, one level deeper (project detail,
// colour demo): 0.8, legal pages: 0.1.
const priorityFor = route => {
  if (route === '/privacy' || route === '/imprint') {
    return '0.1';
  }
  if (route.startsWith('/demos/') || route.startsWith('/projects/')) {
    return '0.8';
  }
  return '1.0';
};

// The sitemap mirrors the routing table: each static route is followed by
// the concrete instances of the parameterized routes it declares.
const entries = [{ url: `${SITE_ORIGIN}/`, priority: '1.0' }];
for (const route of staticRoutes) {
  entries.push({ url: `${SITE_ORIGIN}${route}`, priority: priorityFor(route) });
  if (route === '/blog') {
    blogEntries.forEach(entry =>
      entries.push({
        url: `${SITE_ORIGIN}/blog/${entry.path}`,
        lastmod: `${entry.lastmod}${LASTMOD_TIME}`,
        priority: '1.0',
      })
    );
  } else if (route === '/projects') {
    projectIds
      .slice()
      .sort()
      .forEach(id =>
        entries.push({
          url: `${SITE_ORIGIN}/projects/${id}`,
          priority: '0.8',
        })
      );
  } else if (route === '/demos/colour') {
    colourVariants
      .slice()
      .sort()
      .forEach(variant =>
        entries.push({
          url: `${SITE_ORIGIN}/demos/colour/${variant}`,
          priority: '0.8',
        })
      );
  }
}

const seenUrls = new Set();
const duplicateUrls = entries
  .filter(entry => {
    if (seenUrls.has(entry.url)) {
      return true;
    }
    seenUrls.add(entry.url);
    return false;
  })
  .map(entry => entry.url);
if (duplicateUrls.length) {
  console.error(`Duplicate URLs in the generated sitemap:`);
  duplicateUrls.forEach(url => console.error(`  - ${url}`));
  process.exit(1);
}

const escapeXml = value =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const urlBlocks = entries
  .map(entry => {
    const lines = ['\t<url>', `\t\t<loc>${escapeXml(entry.url)}</loc>`];
    if (entry.lastmod) {
      lines.push(`\t\t<lastmod>${entry.lastmod}</lastmod>`);
    }
    lines.push(`\t\t<priority>${entry.priority}</priority>`);
    lines.push('\t</url>');
    return lines.join('\n');
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlBlocks}\n</urlset>\n`;

if (checkOnly) {
  const current = readFileSync(sitemapPath, 'utf8');
  if (current !== sitemap) {
    console.error(
      'src/assets/sitemap.xml is out of date. Re-run without --check.'
    );
    process.exit(1);
  }
  console.log('src/assets/sitemap.xml is up to date.');
} else {
  writeFileSync(sitemapPath, sitemap);
  console.log(
    `Wrote ${entries.length} URLs to src/assets/sitemap.xml ` +
      `(${staticRoutes.length + 1} static, ${blogEntries.length} blog, ` +
      `${projectIds.length} projects, ${colourVariants.length} colour demos).`
  );
}
