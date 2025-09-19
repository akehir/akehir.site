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
  template: ` <markdown (ready)="onMarkdownReady()" [src]="src()"> </markdown>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent],
})
export class BlogEntryComponent {
  src = input.required<string>();
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
