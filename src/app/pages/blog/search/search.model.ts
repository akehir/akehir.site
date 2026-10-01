export type SearchSort = 'relevance' | 'newest' | 'oldest' | 'title';

export const DEFAULT_SORT: SearchSort = 'newest';

// A record of the generated search index (src/assets/search-index.json),
// produced by tools/generate-search-index.mjs. One record per non-hidden
// blog entry.
export interface IndexEntry {
  slug: string;
  title: string;
  author: string;
  mainCategory: string;
  categories: string[];
  publishedDate: string;
  modifiedDate: string;
  routerLink: string;
  content: string;
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  mainCategories?: string[];
  authors?: string[];
  from?: string;
  to?: string;
  sort?: SearchSort;
}

export interface SearchResult {
  entry: IndexEntry;
  score: number;
  snippet?: string;
  snippetTerm?: string;
}

export interface SearchFacets {
  categories: string[];
  mainCategories: string[];
  authors: string[];
  minDate: string;
  maxDate: string;
}
