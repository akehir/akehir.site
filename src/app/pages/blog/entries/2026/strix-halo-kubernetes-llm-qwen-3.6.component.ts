import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2026/strix-halo-kubernetes-llm-qwen-3.6.md?raw';

@Component({
  selector: 'ake-blog-strix-halo-kubernetes-llm-qwen-3-6',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class StrixHaloKubernetesLlmQwen3_6Component {
  markdown = rawMarkdown;
}
