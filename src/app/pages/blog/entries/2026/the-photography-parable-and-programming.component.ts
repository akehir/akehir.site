import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2026/the-photography-parable-and-programming.md?raw';

@Component({
  selector: 'ake-blog-the-photography-parable-and-programming',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class ThePhotographyParableAndProgrammingComponent {
  markdown = rawMarkdown;
}
