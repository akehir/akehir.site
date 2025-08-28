
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'ake-blog-llama-cpp-docker-rocm-gpt-oss',
  template: `
    <markdown [src]="'/assets/blog/llama-cpp-docker-rocm-gpt-oss.md'"></markdown>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownComponent,
  ],
})
export class LlamaCppDockerRocmGptOssComponent {}
