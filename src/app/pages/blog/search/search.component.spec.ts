import { Component } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed, tick, fakeAsync, ComponentFixture } from '@angular/core/testing';

import { BlogSearchComponent } from './search.component';
import { IndexEntry } from './search.model';

const ENTRIES: IndexEntry[] = [
  {
    slug: 'git-reset',
    title: 'git reset',
    author: 'Raphael Ochsenbein',
    mainCategory: 'Programming',
    categories: ['Programming', 'git'],
    publishedDate: '2025-03-20',
    modifiedDate: '2025-03-20',
    routerLink: '/blog/git-reset',
    content: 'git reset is a surprisingly powerful command.',
  },
  {
    slug: 'docker-basics',
    title: 'Docker basics',
    author: 'Raphael Ochsenbein',
    mainCategory: 'Infrastructure',
    categories: ['Docker', 'Infrastructure'],
    publishedDate: '2025-05-10',
    modifiedDate: '2025-05-10',
    routerLink: '/blog/docker-basics',
    content: 'How to containerise an application with Docker.',
  },
];

@Component({
  selector: 'ake-blog-search-host',
  template: `<ake-blog-search [mode]="mode"></ake-blog-search>`,
  imports: [BlogSearchComponent],
})
class HostComponent {
  mode: 'page' | 'inline' = 'page';
}

describe('BlogSearchComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let http: HttpTestingController;

  function searchEl(): HTMLElement {
    return fixture.nativeElement.querySelector('ake-blog-search');
  }

  function resultTitles(): string[] {
    return [
      ...searchEl().querySelectorAll('.ake-blog-search--result-link'),
    ].map(link => link.textContent.trim()),
  }

  function countText(): string {
    return searchEl().querySelector('.ake-blog-search--count').textContent.trim();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideRouter([]),
        BlogSearchComponent,
        HostComponent,
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('shows a loading state and then the results', fakeAsync(() => {
    const req = http.expectOne('/assets/search-index.json');
    expect(searchEl().querySelector('.ake-blog-search--loading')).toBeTruthy();
    req.flush(ENTRIES);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(countText()).toBe('2 results');
    expect(resultTitles()).toEqual(['Docker basics', 'git reset']);
  }));

  it('filters the results while typing a query', fakeAsync(() => {
    const req = http.expectOne('/assets/search-index.json');
    req.flush(ENTRIES);
    fixture.detectChanges();
    tick();
    const input = searchEl().querySelector('input') as HTMLInputElement;
    input.value = 'git';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    expect(resultTitles()).toEqual(['git reset']);
    expect(countText()).toBe('1 result');
  }));

  it('shows an empty state and a clear button when nothing matches', fakeAsync(() => {
    const req = http.expectOne('/assets/search-index.json');
    req.flush(ENTRIES);
    fixture.detectChanges();
    tick();
    const input = searchEl().querySelector('input') as HTMLInputElement;
    input.value = 'zzz-no-match';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    expect(searchEl().querySelector('.ake-blog-search--empty')).toBeTruthy();
    expect(searchEl().querySelector('.ake-blog-search--clear')).toBeTruthy();
  }));

  it('renders facet chips from the index', fakeAsync(() => {
    const req = http.expectOne('/assets/search-index.json');
    req.flush(ENTRIES);
    fixture.detectChanges();
    tick();
    const chips = [
      ...searchEl().querySelectorAll('.ake-blog-search--chip'),
    ].map(chip => chip.textContent.trim());
    expect(chips).toContain('Docker');
    expect(chips).toContain('git');
    expect(chips).toContain('Infrastructure');
    expect(chips).toContain('Programming');
    expect(chips).toContain('Raphael Ochsenbein');
  }));

  it('filters by a category chip', fakeAsync(() => {
    const req = http.expectOne('/assets/search-index.json');
    req.flush(ENTRIES);
    fixture.detectChanges();
    tick();
    const chips = Array.from(
      searchEl().querySelectorAll('.ake-blog-search--chip')
    );
    const dockerChip = chips.find(chip =>
      chip.textContent.includes('Docker')
    );
    dockerChip.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick();
    expect(resultTitles()).toEqual(['Docker basics']);
    expect(dockerChip.classList.contains('ake-blog-search--chip-active')).toBeTrue();
  }));

  it('shows an error state when the index cannot be loaded', fakeAsync(() => {
    const req = http.expectOne('/assets/search-index.json');
    req.error(new ErrorEvent('boom'));
    fixture.detectChanges();
    tick();
    expect(searchEl().querySelector('.ake-blog-search--error')).toBeTruthy();
  }));
});
