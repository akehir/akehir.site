import {
  Component,
  DOCUMENT,
  inject,
  input,
  PLATFORM_ID,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { copyToClipboard } from '@core/util';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ake-blog-entry',
  template: `
    <markdown
      (ready)="onMarkdownReady()"
      [data]="markdown() || null"
      [src]="markdown() ? null : src()">
      <h1>{{ title() }}</h1>
      @let _publishedDate = publishedDate();
      @if (_publishedDate) {
        <p>
          <em>Published: {{ _publishedDate }}</em>
        </p>
      }
    </markdown>
    <div>
      <h2>Source</h2>
      <p><a [href]="sourceLink()" target="_blank">Open Gitlab</a></p>
    </div>
  `,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [MarkdownComponent],
})
export class BlogEntryComponent {
  markdown = input<string>('');
  src = input.required<string>();
  title = input.required<string>();
  sourceLink = input.required<string>();
  publishedDate = input<string>();
  markdownComponent = viewChild(MarkdownComponent);
  document = inject(DOCUMENT);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  onMarkdownReady() {
    if (!this.isBrowser) {
      return;
    }

    this.document.querySelectorAll('pre').forEach(el => {
      if (el instanceof HTMLElement) {
        el.addEventListener('click', ev => {
          if (ev.target === el) {
            copyToClipboard(el.innerText, this.document);
            if (!environment.production) {
              console.log('Copied to clipboard: ' + el.innerText);
            }
          }
        });
      }
    });
  }
}
