import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogData, blogEntries } from './blog.module';

@Component({
  selector: 'ake-blog-entries',
  templateUrl: './entries.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
})
export class EntriesComponent {
  entries: BlogData[] = blogEntries
    .map(({ data }) => ({
      ...data,
    }))
    .filter(({ hidden }) => !hidden)
    .sort(
      // newest entries first.
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );
}
