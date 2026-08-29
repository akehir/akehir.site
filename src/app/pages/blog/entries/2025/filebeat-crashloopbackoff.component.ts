import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/filebeat-crashloopbackoff.md?raw';

@Component({
  selector: 'ake-blog-filebeat-crashloopbackoff',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class FileBeatCrashLoopBackOffComponent {
  markdown = rawMarkdown;
}
