import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { copyToClipboard } from '@core/util';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ake-blog-entry',
  template: `
    <markdown (ready)="onMarkdownReady()" [src]="src()">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent],
})
export class BlogEntryComponent {
  src = input.required<string>();
  title = input.required<string>();
  sourceLink = input.required<string>();
  publishedDate = input<string>();
  markdown = viewChild(MarkdownComponent);
  document = inject(DOCUMENT);

  onMarkdownReady() {
    this.document.querySelectorAll('pre').forEach(el => {
      if (el instanceof HTMLElement) {
        el.addEventListener('click', ev => {
          if (ev.target === el) {
            copyToClipboard(el.innerText);
            if (!environment.production) {
              console.log('Copied to clipboard: ' + el.innerText);
            }
          }
        });
      }
    });
  }
}
