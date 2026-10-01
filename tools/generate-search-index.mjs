#!/usr/bin/env node
/**
 * Generates src/assets/search-index.json from the blogEntries array in
 * src/app/pages/blog/blog.module.ts for the client-side blog search.
 *
 * The index is an array with one record per non-hidden blog entry:
 *   { slug, title, author, mainCategory, categories, publishedDate,
 *     modifiedDate, routerLink, content }
 *
 * `content` is the entry's Markdown converted to plain text (via the
 * `marked` dependency), so the index is token-searchable without shipping
 * raw Markdown. `slug` is derived from the routerLink.
 *
 * Usage: node tools/generate-search-index.mjs
 *        node tools/generate-search-index.mjs --check  (no files are written)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes('--check');

const blogModulePath = path.join(root, 'src/app/pages/blog/blog.module.ts');
const indexPath = path.join(root, 'src/assets/search-index.json');

const source = readFileSync(blogModulePath, 'utf8');

const entriesSource = source
  .slice(
    source.indexOf('export const blogEntries: BlogRoute[] = ['),
    source.indexOf('const routes: Routes = [')
  )
  .replace(/\/\*.*?\*\//gs, '');

// Matches the start of a data field line: leading spaces, a known key,
// optional spaces, a colon, optional spaces.
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
    path: routePath,
    title: readField(fields.title),
    author: readField(fields.author),
    mainCategory: readField(fields.mainCategory),
    publishedDate: readField(fields.publishedDate),
    modifiedDate: readField(fields.modifiedDate),
    routerLink: readField(fields.routerLink),
    content: readField(fields.content),
    categoryList: Array.isArray(readField(fields.categories))
      ? readField(fields.categories)
      : [],
    hidden: 'hidden' in fields && /true/.test(fields.hidden),
  };
  entries.push(data);
}

if (entries.length === 0) {
  console.error('No blog entries parsed from blog.module.ts');
  process.exit(1);
}

const visibleEntries = entries.filter(entry => !entry.hidden);
for (const entry of visibleEntries) {
  for (const required of [
    'title',
    'author',
    'mainCategory',
    'publishedDate',
    'modifiedDate',
    'routerLink',
    'content',
  ]) {
    if (!entry[required]) {
      console.error(
        `Blog entry "${entry.path}" is missing the "${required}" field.`
      );
      process.exit(1);
    }
  }
  if (entry.categoryList.length === 0) {
    console.error(`Blog entry "${entry.path}" has no categories.`);
    process.exit(1);
  }
}

// Converts the entry Markdown to plain text so the index is token-searchable
// without shipping raw Markdown.
function markdownToPlainText(markdown) {
  const html = marked.parse(markdown, { async: false });
  const withoutMath = html.replace(
    /<span[^>]*>\s*(?:<span[^>]*>)?\\\(.*?\\\)(?:<\/span>)?\s*<\/span>/gs,
    ' '
  );
  const withoutCode = withoutMath.replace(/<code[^>]*>.*?<\/code>/gs, ' ');
  const withoutPre = withoutCode.replace(/<pre[^>]*>.*?<\/pre>/gs, ' ');
  const withoutLinks = withoutPre
    .replace(/<img[^>]*>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return withoutLinks
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const index = visibleEntries
  .map(entry => {
    const contentPath = path.join(root, 'src', entry.content);
    const markdown = readFileSync(contentPath, 'utf8');
    let content = markdownToPlainText(markdown);
    // The Markdown's H1 renders as the title of the entry page, so the
    // leading title text would only duplicate the searchable `title` field.
    if (content.toLowerCase().startsWith(entry.title.toLowerCase())) {
      content = content.slice(entry.title.length).trim();
    }
    return {
      slug: entry.routerLink.replace(/^\/blog\//, ''),
      title: entry.title,
      author: entry.author,
      mainCategory: entry.mainCategory,
      categories: entry.categoryList,
      publishedDate: entry.publishedDate,
      modifiedDate: entry.modifiedDate,
      routerLink: entry.routerLink,
      content,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

const output = JSON.stringify(index, null, 2) + '\n';

if (checkOnly) {
  const current = readFileSync(indexPath, 'utf8');
  if (current !== output) {
    console.error(
      'src/assets/search-index.json is out of date. Re-run without --check.'
    );
    process.exit(1);
  }
  console.log('src/assets/search-index.json is up to date.');
} else {
  writeFileSync(indexPath, output);
  console.log(
    `Wrote ${index.length} entries to src/assets/search-index.json`
  );
}
