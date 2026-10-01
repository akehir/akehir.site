import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogSearchComponent } from './search.component';

@Component({
  selector: 'ake-blog-search-page',
  template: `
    <div>
      <h1>Search</h1>
      <ake-blog-search mode="page"></ake-blog-search>
    </div>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogSearchComponent],
})
export class BlogSearchPageComponent {}
