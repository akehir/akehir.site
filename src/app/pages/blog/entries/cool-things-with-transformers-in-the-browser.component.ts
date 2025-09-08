import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './entry.component';

@Component({
  selector: 'ake-blog-cool-things-with-transformers-in-the-browser',
  template: ` <ake-blog-entry
    [src]="
      '/assets/blog/cool-things-with-transformers-in-the-browser.md'
    "></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class CoolThingsWithTransformersInTheBrowserComponent {}
