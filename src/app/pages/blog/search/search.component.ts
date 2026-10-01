import { ChangeDetectionStrategy, Component, effect, input, output, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { SearchIndexService } from './search-index.service';
import { DEFAULT_SORT, SearchFilters, SearchSort } from './search.model';

function splitCsv(value: string | null): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map(part => part.trim())
    .filter(part => part !== '');
}

function readSort(value: string | null): SearchSort {
  return value === 'relevance' || value === 'newest' || value === 'oldest' || value === 'title'
    ? value
    : DEFAULT_SORT;
}

function sameList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

@Component({
  selector: 'ake-blog-search',
  templateUrl: './search.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
})
export class BlogSearchComponent {
  mode = input<'page' | 'inline'>('page');
  activeChange = output<boolean>();

  service = inject(SearchIndexService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  query = signal('');
  categories = signal<string[]>([]);
  mainCategories = signal<string[]>([]);
  authors = signal<string[]>([]);
  from = signal('');
  to = signal('');
  sort = signal<SearchSort>(DEFAULT_SORT);

  facets = computed(() => this.service.facets());

  results = computed(() => this.service.search(this.query(), this.filters()));

  active = computed(
    () =>
      this.query().trim() !== '' ||
      this.categories().length > 0 ||
      this.mainCategories().length > 0 ||
      this.authors().length > 0 ||
      this.from() !== '' ||
      this.to() !== ''
  );

  sortOptions: { value: SearchSort; label: string }[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'title', label: 'Title A–Z' },
  ];

  constructor() {
    this.service.load();
    this.#route.queryParamMap.subscribe(params => this.#applyParams(params));
    effect(() => this.activeChange.emit(this.active()));
  }

  filters(): SearchFilters {
    return {
      query: this.query(),
      categories: this.categories(),
      mainCategories: this.mainCategories(),
      authors: this.authors(),
      from: this.from(),
      to: this.to(),
      sort: this.sort(),
    };
  }

  isCategorySelected(category: string): boolean {
    return this.categories().includes(category);
  }

  isMainCategorySelected(mainCategory: string): boolean {
    return this.mainCategories().includes(mainCategory);
  }

  isAuthorSelected(author: string): boolean {
    return this.authors().includes(author);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.#syncParams();
  }

  toggleCategory(category: string): void {
    this.categories.update(current =>
      current.includes(category)
        ? current.filter(value => value !== category)
        : [...current, category]
    );
    this.#syncParams();
  }

  toggleMainCategory(mainCategory: string): void {
    this.mainCategories.update(current =>
      current.includes(mainCategory)
        ? current.filter(value => value !== mainCategory)
        : [...current, mainCategory]
    );
    this.#syncParams();
  }

  toggleAuthor(author: string): void {
    this.authors.update(current =>
      current.includes(author)
        ? current.filter(value => value !== author)
        : [...current, author]
    );
    this.#syncParams();
  }

  onFromChange(value: string): void {
    this.from.set(value);
    this.#syncParams();
  }

  onToChange(value: string): void {
    this.to.set(value);
    this.#syncParams();
  }

  onSortChange(value: string): void {
    this.sort.set(readSort(value));
    this.#syncParams();
  }

  clearFilters(): void {
    this.query.set('');
    this.categories.set([]);
    this.mainCategories.set([]);
    this.authors.set([]);
    this.from.set('');
    this.to.set('');
    this.sort.set(DEFAULT_SORT);
    this.#syncParams();
  }

  sortModel(): string {
    return this.query().trim() !== '' ? 'relevance' : this.sort();
  }

  #applyParams(params: ParamMap): void {
    const nextQuery = params.get('q') ?? '';
    const nextCategories = splitCsv(params.get('cat'));
    const nextMainCategories = splitCsv(params.get('group'));
    const nextAuthors = splitCsv(params.get('author'));
    const nextFrom = params.get('from') ?? '';
    const nextTo = params.get('to') ?? '';
    const nextSort = readSort(params.get('sort'));
    if (
      nextQuery === this.query() &&
      sameList(nextCategories, this.categories()) &&
      sameList(nextMainCategories, this.mainCategories()) &&
      sameList(nextAuthors, this.authors()) &&
      nextFrom === this.from() &&
      nextTo === this.to() &&
      nextSort === this.sort()
    ) {
      return;
    }
    this.query.set(nextQuery);
    this.categories.set(nextCategories);
    this.mainCategories.set(nextMainCategories);
    this.authors.set(nextAuthors);
    this.from.set(nextFrom);
    this.to.set(nextTo);
    this.sort.set(nextSort);
  }

  #syncParams(): void {
    const next: Record<string, string> = {
      q: this.query(),
      cat: this.categories().join(','),
      group: this.mainCategories().join(','),
      author: this.authors().join(','),
      from: this.from(),
      to: this.to(),
      sort: this.sort() === DEFAULT_SORT ? '' : this.sort(),
    };
    const current = this.#route.snapshot.queryParams;
    const keys = [...new Set([...Object.keys(next), ...Object.keys(current)])];
    if (
      !keys.some(key => (next[key] ?? '') !== (String(current[key] ?? '')))
    ) {
      return;
    }
    const params: Record<string, string> = {};
    for (const key of Object.keys(next)) {
      if (next[key] !== '') {
        params[key] = next[key];
      }
    }
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: params,
      replaceUrl: true,
    });
  }
}
