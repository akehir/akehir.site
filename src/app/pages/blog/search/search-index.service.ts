import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  DEFAULT_SORT,
  IndexEntry,
  SearchFacets,
  SearchFilters,
  SearchResult,
  SearchSort,
} from './search.model';

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'had',
  'has',
  'have',
  'he',
  'her',
  'his',
  'how',
  'i',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'she',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'to',
  'was',
  'we',
  'were',
  'what',
  'when',
  'which',
  'while',
  'who',
  'will',
  'with',
  'you',
  'your',
]);

const TITLE_WEIGHT = 5;
const CATEGORY_WEIGHT = 2;
const AUTHOR_WEIGHT = 2;
const BODY_WEIGHT = 1;
const BODY_MATCH_CAP = 4;
const BODY_SUBSTRING_BONUS = 1;

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}]+/gu);
  return matches ? matches : [];
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function searchBlogEntries(
  entries: IndexEntry[],
  query: string,
  filters: SearchFilters = {}
): SearchResult[] {
  const tokens = [...new Set(tokenize(query).filter(token => !STOPWORDS.has(token)))];
  const hasQuery = tokens.length > 0;
  const selectedCategories = new Set(filters.categories ?? []);
  const selectedMainCategories = new Set(filters.mainCategories ?? []);
  const selectedAuthors = new Set(filters.authors ?? []);
  const from = filters.from || '';
  const to = filters.to || '';
  const sort = hasQuery ? 'relevance' : filters.sort ?? DEFAULT_SORT;

  const results: SearchResult[] = [];

  for (const entry of entries) {
    if (
      selectedCategories.size > 0 &&
      !entry.categories.some(category => selectedCategories.has(category))
    ) {
      continue;
    }
    if (
      selectedMainCategories.size > 0 &&
      !selectedMainCategories.has(entry.mainCategory)
    ) {
      continue;
    }
    if (
      selectedAuthors.size > 0 &&
      !selectedAuthors.has(entry.author)
    ) {
      continue;
    }
    const inRange = (date: string) =>
      date !== '' && (from === '' || date >= from) && (to === '' || date <= to);
    if (
      (from !== '' || to !== '') &&
      !inRange(entry.publishedDate) &&
      !inRange(entry.modifiedDate)
    ) {
      continue;
    }

    let score = 0;
    if (hasQuery) {
      const title = entry.title.toLowerCase();
      const categories = entry.categories.join(' ').toLowerCase();
      const mainCategory = entry.mainCategory.toLowerCase();
      const author = entry.author.toLowerCase();
      const content = entry.content.toLowerCase();
      let matched = false;
      for (const token of tokens) {
        if (title.includes(token)) {
          score += TITLE_WEIGHT;
          matched = true;
        }
        if (categories.includes(token) || mainCategory.includes(token)) {
          score += CATEGORY_WEIGHT;
          matched = true;
        }
        if (author.includes(token)) {
          score += AUTHOR_WEIGHT;
          matched = true;
        }
        if (content.includes(token)) {
          score += BODY_WEIGHT;
          matched = true;
        }
      }
      if (!matched) {
        continue;
      }
      for (const term of query
        .trim()
        .split(/\s+/)
        .filter(term => term.length >= 3)) {
        if (entry.content.toLowerCase().includes(term.toLowerCase())) {
          score += BODY_SUBSTRING_BONUS;
        }
      }
      const bodyCap = tokens.length * BODY_MATCH_CAP;
      if (score > bodyCap) {
        score = bodyCap;
      }
    }

    const result: SearchResult = { entry, score };
    if (hasQuery) {
      const snippet = findSnippet(entry.content, tokens);
      if (snippet) {
        result.snippet = snippet.html;
        result.snippetTerm = snippet.term;
      }
    }
    results.push(result);
  }

  const byNewest = (a: SearchResult, b: SearchResult) =>
    b.entry.publishedDate.localeCompare(a.entry.publishedDate);
  switch (sort) {
    case 'oldest':
      results.sort((a, b) => a.entry.publishedDate.localeCompare(b.entry.publishedDate) || byNewest(a, b));
      break;
    case 'title':
      results.sort(
        (a, b) => a.entry.title.localeCompare(b.entry.title) || byNewest(a, b)
      );
      break;
    default:
      results.sort(
        (a, b) => b.score - a.score || byNewest(a, b)
      );
      break;
  }
  return results;
}

export function findSnippet(
  content: string,
  tokens: string[],
  radius: number = 60
): { html: string; term: string } | null {
  let best: { start: number; end: number; term: string } | null = null;
  for (const token of tokens) {
    const index = content.toLowerCase().indexOf(token);
    if (index === -1) {
      continue;
    }
    if (
      !best ||
      index < best.start ||
      (index === best.start && token.length > best.term.length)
    ) {
      best = { start: index, end: index + token.length, term: token };
    }
  }
  if (!best) {
    return null;
  }
  let start = best.start;
  let end = best.end;
  if (start > 0) {
    start = Math.max(0, start - radius);
    const boundary = content.lastIndexOf(' ', start);
    if (boundary > 0 && boundary < start) {
      start = boundary + 1;
    }
  }
  if (end < content.length) {
    end = Math.min(content.length, best.end + radius);
    const boundary = content.indexOf(' ', end - 1);
    if (boundary !== -1 && boundary > end - 1) {
      end = boundary;
    }
  }
  const prefix = start > 0 ? '…' : '';
  const suffix = end < content.length ? '…' : '';
  const before = content.slice(start, best.start);
  const term = content.slice(best.start, best.end);
  const after = content.slice(best.end, end);
  const html = `${prefix}${before}<mark>${term}</mark>${after}${suffix}`;
  return { html, term: term.toLowerCase() };
}

export function deriveSearchFacets(entries: IndexEntry[]): SearchFacets {
  const categories = [...new Set(entries.flatMap(entry => entry.categories))].sort((a, b) =>
    a.localeCompare(b)
  );
  const mainCategories = [
    ...new Set(entries.map(entry => entry.mainCategory)),
  ].sort((a, b) => a.localeCompare(b));
  const authors = [...new Set(entries.map(entry => entry.author))].sort((a, b) =>
    a.localeCompare(b)
  );
  const dates = entries.flatMap(entry => [entry.publishedDate, entry.modifiedDate]);
  return {
    categories,
    mainCategories,
    authors,
    minDate: dates.length > 0 ? dates.reduce((a, b) => (a < b ? a : b), '') : '',
    maxDate: dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b), '') : '',
  };
}

@Injectable({ providedIn: 'root' })
export class SearchIndexService {
  #http = inject(HttpClient);
  #requested = false;

  readonly index = signal<IndexEntry[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly facets = computed(() => deriveSearchFacets(this.index()));

  search(query: string, filters: SearchFilters = {}): SearchResult[] {
    return searchBlogEntries(this.index(), query, filters);
  }

  load(): void {
    if (this.#requested) {
      return;
    }
    this.#requested = true;
    this.#http
      .get<IndexEntry[]>('/assets/search-index.json')
      .subscribe({
        next: entries => {
          this.index.set(entries);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }
}
