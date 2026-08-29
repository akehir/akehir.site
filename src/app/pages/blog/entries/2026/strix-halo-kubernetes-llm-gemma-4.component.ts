import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2026/strix-halo-kubernetes-llm-gemma-4.md?raw';

@Component({
  selector: 'ake-blog-strix-halo-kubernetes-llm-gpt-oss',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class StrixHaloKubernetesLlmGemma4Component {
  markdown = rawMarkdown;
}
