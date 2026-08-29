import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/ssh-wireguard-mobile-hotspot-issue.md?raw';

@Component({
  selector: 'ake-blog-ssh-wireguard-mobile-hotspot-issue',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class SSHWireguardMobileHotspotIssueComponent {
  markdown = rawMarkdown;
}
