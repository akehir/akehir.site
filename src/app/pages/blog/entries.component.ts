import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogData, blogEntries } from './blog.module';

type EntryCategory =
  | 'Android'
  | 'ChromeOS'
  | 'Linux'
  | 'Meta'
  | 'Machine Learning'
  | 'Software'
  | 'Infrastructure'
  | 'Gaming'
  | 'Fonduest Memories'
  | 'Travel'
  | "Raphael's Random Rumblings"
  | 'Programming'
  | 'Reading'
  | 'Self-Hosting';

@Component({
  selector: 'ake-blog-entries',
  templateUrl: './entries.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class EntriesComponent {
  entries: BlogData[] = blogEntries
    .map(({ data }) => ({
      ...data,
    }))
    .sort(
      // newest entries first.
      (a, b) =>
        new Date(a.publishedDate).getTime() -
        new Date(b.publishedDate).getTime()
    );
}
