import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'ake-blog-ssh-wireguard-mobile-hotspot-issue',
  template: `
    <markdown [src]="'/assets/blog/ssh-wireguard-mobile-hotspot-issue.md'"></markdown>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownComponent,
  ],
})
export class SSHWireguardMobileHotspotIssueComponent {}
