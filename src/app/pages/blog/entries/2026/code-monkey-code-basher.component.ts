import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2026/code-monkey-code-basher.md?raw';

@Component({
  selector: 'ake-blog-code-monkey-code-basher',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class CodeMonkeyCodeBasherComponent {
  markdown = rawMarkdown;
}
