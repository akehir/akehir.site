#!/usr/bin/env node
/**
 * Generates src/assets/rss.xml from the blogEntries array in
 * src/app/pages/blog/blog.module.ts, and cross-checks
 * src/assets/sitemap.xml against the blog entries and the Angular routes.
 *
 * Usage: node tools/generate-rss-feed.mjs
 *        node tools/generate-rss-feed.mjs --check  (no files are written)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes('--check');

const SITE_ORIGIN = 'https://akehir.com';
const blogModulePath = path.join(root, 'src/app/pages/blog/blog.module.ts');
const rssPath = path.join(root, 'src/assets/rss.xml');
const sitemapPath = path.join(root, 'src/assets/sitemap.xml');

const source = readFileSync(blogModulePath, 'utf8');

const entriesSource = source
  .slice(
    source.indexOf('export const blogEntries: BlogRoute[] = ['),
    source.indexOf('const routes: Routes = [')
  )
  .replace(/\/\*.*?\*\//gs, '');

// Matches the start of a data field line: leading spaces, a known key,
// optional spaces, a colon, optional spaces. No backslashes needed.
const FIELD_RE =
  /^( *)(title|author|mainCategory|categories|publishedDate|modifiedDate|routerLink|content|source|hidden) *: */;

// Extracts all quoted string parts (single or double quoted, with escapes).
function readQuoted(text) {
  const parts = [];
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === "'" || c === '"') {
      const q = c;
      i += 1;
      let s = '';
      while (i < text.length) {
        const cc = text[i];
        if (cc === '\\' && i + 1 < text.length) {
          s += text[i + 1];
          i += 2;
          continue;
        }
        if (cc === q) {
          i += 1;
          break;
        }
        s += cc;
        i += 1;
      }
      parts.push(s);
    } else {
      i += 1;
    }
  }
  return parts;
}

// Splits a data block into { fieldName: rawValueText } using the field
// boundaries; multi-line values (e.g. source) accumulate onto the key.
function extractDataFields(block) {
  const fields = {};
  let current = null;
  let buf = [];
  const push = () => {
    if (current !== null) {
      fields[current] = buf.join('\n');
    }
  };
  for (const line of block.split('\n')) {
    const m = FIELD_RE.exec(line);
    if (m) {
      push();
      current = m[2];
      buf = [line.slice(m[0].length)];
    } else if (current !== null) {
      buf.push(line);
    }
  }
  push();
  return fields;
}

function readField(raw) {
  if (raw === undefined) {
    return undefined;
  }
  const text = raw.trim();
  const parts = readQuoted(text);
  if (parts.length === 0) {
    return text === '' ? '' : text;
  }
  return /\[/.test(text) ? parts : parts.join('');
}

const entries = [];
const entryRegex =
  /\{\s*path:\s*'([^']+)',\s*title:[\s\S]*?data:\s*\{([\s\S]*?)\}\s*,\s*loadComponent:/g;

let match;
while ((match = entryRegex.exec(entriesSource)) !== null) {
  const [, routePath, dataSource] = match;
  const fields = extractDataFields(dataSource);
  const data = {
    title: readField(fields.title),
    author: readField(fields.author),
    mainCategory: readField(fields.mainCategory),
    publishedDate: readField(fields.publishedDate),
    modifiedDate: readField(fields.modifiedDate),
    routerLink: readField(fields.routerLink),
    content: readField(fields.content),
    source: readField(fields.source),
    categoryList: Array.isArray(readField(fields.categories))
      ? readField(fields.categories)
      : [],
  };
  data.categories = data.categoryList.join(', ');
  data.hidden = 'hidden' in fields && /true/.test(fields.hidden);
  entries.push({ routePath, data });
}

if (entries.length === 0) {
  console.error('No blog entries parsed from blog.module.ts');
  process.exit(1);
}

const visibleEntries = entries.filter(({ data }) => !data.hidden);
for (const { routePath, data } of visibleEntries) {
  for (const required of [
    'title',
    'author',
    'mainCategory',
    'publishedDate',
    'modifiedDate',
    'routerLink',
  ]) {
    if (!data[required]) {
      console.error(
        `Blog entry "${routePath}" is missing the "${required}" field.`
      );
      process.exit(1);
    }
  }
  if (data.categoryList.length === 0) {
    console.error(`Blog entry "${routePath}" has no categories.`);
    process.exit(1);
  }
}

const escapeXml = value =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const dateToRfc822 = isoDate => new Date(`${isoDate}T12:00:00+01:00`).toUTCString();

const feedItems = [...visibleEntries]
  .sort(
    (a, b) =>
      new Date(b.data.publishedDate).getTime() -
      new Date(a.data.publishedDate).getTime()
  )
  .map(({ data }) => {
    const contentPath = data.content ? path.join(root, 'src', data.content) : '';
    const markdown = contentPath ? readFileSync(contentPath, 'utf8') : '';
    const modified = data.modifiedDate || data.publishedDate;
    return [
      '    <item>',
      `      <title>${escapeXml(data.title)}</title>`,
      `      <link>${SITE_ORIGIN}${data.routerLink}</link>`,
      `      <guid isPermaLink="true">${SITE_ORIGIN}${data.routerLink}</guid>`,
      `      <description><![CDATA[${markdown.trim()}]]></description>`,
      `      <category>${escapeXml(data.mainCategory)}</category>`,
      `      <category>${escapeXml(data.categories)}</category>`,
      `      <dc:creator>${escapeXml(data.author)}</dc:creator>`,
      `      <pubDate>${dateToRfc822(data.publishedDate)}</pubDate>`,
      `      <lastBuildDate>${dateToRfc822(modified)}</lastBuildDate>`,
      '    </item>',
    ].join('\n');
  })
  .join('\n');

const latestModified = visibleEntries.reduce(
  (latest, { data }) =>
    (data.modifiedDate || data.publishedDate) > latest
      ? data.modifiedDate || data.publishedDate
      : latest,
  ''
);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Akehir Blog</title>
    <link>${SITE_ORIGIN}/blog</link>
    <atom:link href="${SITE_ORIGIN}/assets/rss.xml" rel="self" type="application/rss+xml" />
    <description>RSS feed with all blog entries of the Akehir blog.</description>
    <language>en</language>
    <copyright>Copyright (c) ${new Date().getFullYear()}, Raphael Ochsenbein</copyright>
    <lastBuildDate>${dateToRfc822(latestModified)}</lastBuildDate>
    <generator>akehir.site (tools/generate-rss-feed.mjs)</generator>
${feedItems}
  </channel>
</rss>
`;

if (checkOnly) {
  const current = readFileSync(rssPath, 'utf8');
  if (current !== rss) {
    console.error('rss.xml is out of date. Re-run without --check.');
    process.exit(1);
  }
  console.log('rss.xml is up to date.');
} else {
  writeFileSync(rssPath, rss);
  console.log(`Wrote ${visibleEntries.length} entries to src/assets/rss.xml`);
}

// --- Sitemap accuracy check ---
const sitemapSource = readFileSync(sitemapPath, 'utf8');
const sitemapUrls = extractLocs(sitemapSource);

function extractLocs(s) {
  const locs = [];
  const open = '<loc>';
  const close = '</loc>';
  let idx = 0;
  for (;;) {
    const a = s.indexOf(open, idx);
    if (a === -1) break;
    const b = s.indexOf(close, a);
    if (b === -1) break;
    locs.push(s.slice(a + open.length, b));
    idx = b + close.length;
  }
  return locs;
}

const blogUrls = new Set(
  visibleEntries.map(({ data }) => `${SITE_ORIGIN}${data.routerLink}`)
);

// Static child pages of the blog module (e.g. /blog/search) that are not
// blog entries but are part of the sitemap. The child route paths come from
// the blog module's children list; the empty path is /blog itself and the
// blog entry paths are already covered by blogUrls.
const blogEntryPaths = new Set(entries.map(({ routePath }) => routePath));
const blogChildrenOpen = source.indexOf('children: [');
const blogChildrenSource =
  blogChildrenOpen === -1
    ? ''
    : source.slice(
        blogChildrenOpen,
        findClosingBracket(
          source,
          blogChildrenOpen + 'children: ['.length - 1
        )
      );
const blogChildUrls = new Set();
const blogChildRegex = /path: '([^']*)'/g;
let childMatch;
while ((childMatch = blogChildRegex.exec(blogChildrenSource)) !== null) {
  const childPath = childMatch[1];
  if (childPath === '' || blogEntryPaths.has(childPath)) {
    continue;
  }
  blogChildUrls.add(`${SITE_ORIGIN}/blog/${childPath}`);
}

// Finds the index of the ']' matching the '[' at openIndex.
function findClosingBracket(sourceText, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < sourceText.length; i += 1) {
    if (sourceText[i] === '[') {
      depth += 1;
    } else if (sourceText[i] === ']') {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

const fail = (msg, lines) => {
  console.error(`\nSitemap issue - ${msg}:\n${lines.join('\n')}`);
  process.exit(1);
};

const missingInSitemap = [...blogUrls].filter(url => !sitemapUrls.includes(url));
const unknownBlogUrls = sitemapUrls.filter(
  url =>
    url.includes('/blog/') &&
    !blogUrls.has(url) &&
    !blogChildUrls.has(url)
);
const duplicateUrls = sitemapUrls.filter(
  (url, index) => sitemapUrls.indexOf(url) !== index
);

if (missingInSitemap.length) {
  fail(
    'blog entries missing from sitemap.xml',
    missingInSitemap.map(url => `  - ${url}`)
  );
}
if (unknownBlogUrls.length) {
  fail(
    'blog URLs in sitemap.xml without a matching entry',
    unknownBlogUrls.map(url => `  - ${url}`)
  );
}
if (duplicateUrls.length) {
  fail(
    'duplicate URLs in sitemap.xml',
    duplicateUrls.map(url => `  - ${url}`)
  );
}

const staticPages = [
  'index',
  'about',
  'blog',
  'curriculum',
  'machina',
  'projects',
  'demos/colour',
  'privacy',
  'imprint',
];
const missingStaticPages = staticPages.filter(
  page =>
    !sitemapUrls.includes(`${SITE_ORIGIN}/${page}`) &&
    !(page === 'index' && sitemapUrls.includes(`${SITE_ORIGIN}/`))
);
if (missingStaticPages.length) {
  fail(
    'static pages missing from sitemap.xml',
    missingStaticPages.map(page => `  - ${SITE_ORIGIN}/${page}`)
  );
}

console.log(`Sitemap check passed (${sitemapUrls.length} URLs).`);
