import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/open-webui-llama-server.md?raw';

@Component({
  selector: 'ake-blog-open-webui-llama-server',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class OpenWebuiLlamaServerComponent {
  markdown = rawMarkdown;
}
