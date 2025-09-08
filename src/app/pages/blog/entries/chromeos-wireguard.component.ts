import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './entry.component';

@Component({
  selector: 'ake-blog-chromeos-wireguard',
  template: ` <ake-blog-entry
    [src]="'/assets/blog/chromeos-wireguard.md'"></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class ChromeOSWireGuardComponent {}
