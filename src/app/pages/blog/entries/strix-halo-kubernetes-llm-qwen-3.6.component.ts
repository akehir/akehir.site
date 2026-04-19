import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryContainerComponent } from './blog-entry-container.component';

@Component({
  selector: 'ake-blog-strix-halo-kubernetes-llm-qwen-3_6',
  template: ` <ake-blog-entry-container></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryContainerComponent],
})
export class StrixHaloKubernetesLlmQwen3_6Component {}
