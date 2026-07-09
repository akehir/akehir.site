import {
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';

@Component({
  selector: 'ake-blog-open-webui-llama-server',
  template: ` <ake-blog-entry-container></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class OpenWebuiLlamaServerComponent {}
