import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/synology-dsm-port-443.md?raw';

@Component({
  selector: 'ake-blog-synology-dsm-port-443',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class SynologyDSMPort443Component {
  markdown = rawMarkdown;
}
