import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/llama-cpp-docker-rocm-gpt-oss.md?raw';

@Component({
  selector: 'ake-blog-llama-cpp-docker-rocm-gpt-oss',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class LlamaCppDockerRocmGptOssComponent {
  markdown = rawMarkdown;
}
