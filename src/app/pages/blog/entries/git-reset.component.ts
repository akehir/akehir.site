import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'ake-blog-git-reset',
  template: `
    <markdown [src]="'/assets/blog/git-reset.md'"></markdown>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownComponent,
  ],
})
export class GitResetComponent {}
