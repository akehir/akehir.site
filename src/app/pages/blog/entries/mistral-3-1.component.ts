import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './entry.component';

@Component({
  selector: 'ake-blog-mistral-3-1',
  template: ` <ake-blog-entry
    [src]="'/assets/blog/mistral-3-1.md'"></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class Mistral31Component {}
