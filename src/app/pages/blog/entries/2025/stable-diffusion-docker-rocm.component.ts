import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/stable-diffusion-docker-rocm.md?raw';

@Component({
  selector: 'ake-blog-stable-diffusion-docker-rocm',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class StableDiffusionDockerRocmComponent {
  markdown = rawMarkdown;
}
