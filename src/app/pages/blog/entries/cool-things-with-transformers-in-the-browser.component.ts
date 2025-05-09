
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'ake-blog-cool-things-with-transformers-in-the-browser',
  template: `
    <markdown [src]="'/assets/blog/cool-things-with-transformers-in-the-browser.md'"></markdown>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownComponent,
  ],
})
export class CoolThingsWithTransfoemersInTheBrowserComponent {

}
