import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/lenovo-ideapad-duet-5-chromebook.md?raw';

@Component({
  selector: 'ake-blog-algovernmentality',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class LenovoIdeapadDuet5ChromebookComponent {
  markdown = rawMarkdown;
}
