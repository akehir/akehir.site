import {
  deriveSearchFacets,
  findSnippet,
  searchBlogEntries,
} from './search-index.service';
import { IndexEntry } from './search.model';

function entry(partial: Partial<IndexEntry> & { slug: string }): IndexEntry {
  return {
    title: partial.slug,
    author: 'Raphael Ochsenbein',
    mainCategory: 'Programming',
    categories: ['Programming'],
    publishedDate: '2025-01-01',
    modifiedDate: '2025-01-01',
    routerLink: `/blog/${partial.slug}`,
    content: '',
    ...partial,
  };
}

const ENTRIES: IndexEntry[] = [
  entry({
    slug: 'git-reset',
    title: 'git reset',
    mainCategory: 'Programming',
    categories: ['Programming', 'git'],
    publishedDate: '2025-03-20',
    modifiedDate: '2025-03-20',
    content:
      'git reset is a surprisingly powerful command for undoing commits.',
  }),
  entry({
    slug: 'docker-basics',
    title: 'Docker basics',
    mainCategory: 'Infrastructure',
    categories: ['Docker', 'Infrastructure'],
    publishedDate: '2025-05-10',
    modifiedDate: '2025-05-10',
    content:
      'How to containerise an application with Docker and sync it with git.',
  }),
  entry({
    slug: 'gemma-review',
    title: 'Gemma review',
    mainCategory: 'Machine Learning',
    categories: ['Machine Learning'],
    publishedDate: '2025-07-01',
    modifiedDate: '2025-07-01',
    content: 'A hands on review of the Gemma models.',
  }),
  entry({
    slug: 'old-post',
    title: 'Old post',
    mainCategory: 'Reading',
    categories: ['Reading'],
    publishedDate: '2014-11-25',
    modifiedDate: '2020-06-01',
    content: 'Something from long ago.',
  }),
];

describe('searchBlogEntries', () => {
  it('returns all entries when there is no query or filter', () => {
    const results = searchBlogEntries(ENTRIES, '');
    expect(results.length).toBe(4);
  });

  it('sorts by newest by default without a query', () => {
    const results = searchBlogEntries(ENTRIES, '');
    expect(results.map(result => result.entry.slug)).toEqual([
      'gemma-review',
      'docker-basics',
      'git-reset',
      'old-post',
    ]);
  });

  it('sorts by oldest with the oldest sort', () => {
    const results = searchBlogEntries(ENTRIES, '', { sort: 'oldest' });
    expect(results.map(result => result.entry.slug)).toEqual([
      'old-post',
      'git-reset',
      'docker-basics',
      'gemma-review',
    ]);
  });

  it('sorts by title with the title sort', () => {
    const results = searchBlogEntries(ENTRIES, '', { sort: 'title' });
    expect(results.map(result => result.entry.slug)).toEqual([
      'docker-basics',
      'git-reset',
      'gemma-review',
      'old-post',
    ]);
  });

  it('matches a token in the title and ranks it above a body-only match', () => {
    const results = searchBlogEntries(ENTRIES, 'git');
    expect(results.map(result => result.entry.slug)).toEqual([
      'git-reset',
      'docker-basics',
    ]);
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it('drops stopwords from the query', () => {
    const results = searchBlogEntries(ENTRIES, 'the and of');
    expect(results.length).toBe(4);
  });

  it('requires every query token to match somewhere in an entry', () => {
    const results = searchBlogEntries(ENTRIES, 'gemma docker');
    expect(results.length).toBe(0);
  });

  it('filters by category (OR within the facet)', () => {
    const results = searchBlogEntries(ENTRIES, '', {
      categories: ['git', 'Docker'],
    });
    expect(results.map(result => result.entry.slug)).toEqual([
      'docker-basics',
      'git-reset',
    ]);
  });

  it('filters by main category (OR within the facet)', () => {
    const results = searchBlogEntries(ENTRIES, '', {
      mainCategories: ['Machine Learning', 'Reading'],
    });
    expect(results.map(result => result.entry.slug)).toEqual([
      'gemma-review',
      'old-post',
    ]);
  });

  it('filters by author', () => {
    const results = searchBlogEntries(ENTRIES, '', {
      authors: ['Raphael Ochsenbein'],
    });
    expect(results.length).toBe(4);
    expect(
      searchBlogEntries(ENTRIES, '', { authors: ['Someone Else'] })
    ).toEqual([]);
  });

  it('combines query and facet filters (AND across facets)', () => {
    const results = searchBlogEntries(ENTRIES, 'git', {
      categories: ['Docker'],
    });
    expect(results.map(result => result.entry.slug)).toEqual([
      'docker-basics',
    ]);
  });

  it('matches the date range against publishedDate', () => {
    const results = searchBlogEntries(ENTRIES, '', {
      from: '2025-04-01',
      to: '2025-12-31',
    });
    expect(results.map(result => result.entry.slug)).toEqual([
      'gemma-review',
      'docker-basics',
    ]);
  });

  it('matches the date range against modifiedDate as well', () => {
    const results = searchBlogEntries(ENTRIES, '', {
      from: '2019-01-01',
      to: '2024-12-31',
    });
    expect(results.map(result => result.entry.slug)).toEqual(['old-post']);
  });

  it('treats the date range bounds as inclusive', () => {
    const results = searchBlogEntries(ENTRIES, '', {
      from: '2025-03-20',
      to: '2025-03-20',
    });
    expect(results.map(result => result.entry.slug)).toEqual(['git-reset']);
  });

  it('keeps the query sort as relevance when a query is present', () => {
    const results = searchBlogEntries(ENTRIES, 'review', { sort: 'oldest' });
    expect(results.map(result => result.entry.slug)).toEqual([
      'gemma-review',
    ]);
  });
});

describe('findSnippet', () => {
  it('wraps the first body match in a mark element', () => {
    const snippet = findSnippet(
      'git reset is a surprisingly powerful command.',
      ['git']
    );
    expect(snippet).toEqual({
      html: '<mark>git</mark> reset is a surprisingly powerful command.',
      term: 'git',
    });
  });

  it('truncates around the match with ellipses', () => {
    const content =
      'unrelated opening text. ' +
      'x'.repeat(200) +
      ' git reset appears late. ' +
      'y'.repeat(200) +
      ' trailing text.';
    const snippet = findSnippet(content, ['git']);
    expect(snippet?.html.startsWith('…')).toBeTrue();
    expect(snippet?.html.endsWith('…')).toBeTrue();
    expect(snippet?.html).toContain('<mark>git</mark>');
  });

  it('prefers the earliest match when several tokens match', () => {
    const snippet = findSnippet(
      'the quick brown fox jumps over the lazy dog',
      ['dog', 'fox']
    );
    expect(snippet?.html).toContain('<mark>fox</mark>');
  });

  it('returns null when no token matches the content', () => {
    expect(findSnippet('nothing here', ['missing'])).toBeNull();
  });
});

describe('deriveSearchFacets', () => {
  it('derives the distinct facet values from the entries', () => {
    const facets = deriveSearchFacets(ENTRIES);
    expect(facets.categories.sort()).toEqual(
      ['Docker', 'Infrastructure', 'Machine Learning', 'Programming', 'Reading', 'git'].sort()
    );
    expect(facets.mainCategories).toContain('Programming');
    expect(facets.authors).toEqual(['Raphael Ochsenbein']);
    expect(facets.minDate).toBe('2014-11-25');
    expect(facets.maxDate).toBe('2025-07-01');
  });
});
