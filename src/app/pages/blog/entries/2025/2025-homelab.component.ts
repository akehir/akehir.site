import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/2025-homelab.md?raw';

@Component({
  selector: 'ake-blog-2025-homelab',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class TwentyTwentyFiveHomelabComponent {
  markdown = rawMarkdown;
}
