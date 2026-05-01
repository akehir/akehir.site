import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';

@Component({
  selector: 'ake-blog-synology-dsm-port-443',
  template: ` <ake-blog-entry-container></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryContainerComponent],
})
export class SynologyDSMPort443Component {}
