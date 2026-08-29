import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models.md?raw';

@Component({
  selector:
    'ake-blog-llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class LlamaSwapAndLlamaCppForSelfHostingMultipleLlmModelsComponent {
  markdown = rawMarkdown;
}
