import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryContainerComponent } from './blog-entry-container.component';

@Component({
  selector: 'ake-blog-ssh-wireguard-mobile-hotspot-issue',
  template: ` <ake-blog-entry-container></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryContainerComponent],
})
export class SSHWireguardMobileHotspotIssueComponent {}
