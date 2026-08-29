import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/rid-google-ai-overview.md?raw';

@Component({
  selector: 'ake-blog-rid-google-ai-overview',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class RidGoogleAIOverviewComponent {
  markdown = rawMarkdown;
}
