import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './entry.component';

@Component({
  selector: 'ake-blog-ssh-wireguard-mobile-hotspot-issue',
  template: ` <ake-blog-entry
    [src]="
      '/assets/blog/ssh-wireguard-mobile-hotspot-issue.md'
    "></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class SSHWireguardMobileHotspotIssueComponent {}
