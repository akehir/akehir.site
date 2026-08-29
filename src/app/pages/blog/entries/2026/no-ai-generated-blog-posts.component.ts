import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2026/no-ai-generated-blog-posts.md?raw';

@Component({
  selector: 'ake-blog-no-ai-generated-blog-posts',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class NoAiGeneratedBlogPostsComponent {
  markdown = rawMarkdown;
}
