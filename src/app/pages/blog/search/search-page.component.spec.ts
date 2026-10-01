import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BlogSearchPageComponent } from './search-page.component';
import { BlogSearchComponent } from './search.component';

describe('BlogSearchPageComponent', () => {
  let fixture: ComponentFixture<BlogSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BlogSearchPageComponent,
        BlogSearchComponent,
        HttpClientTestingModule,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogSearchPageComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the heading and the shared search component', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toBe('Search');
    expect(el.querySelector('ake-blog-search')).toBeTruthy();
  });
});
