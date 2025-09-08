import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './entry.component';

@Component({
  selector: 'ake-blog-kubernetes-dashboard-no-kong-proxy',
  template: ` <ake-blog-entry
    [src]="
      '/assets/blog/kubernetes-dashboard-no-kong-proxy.md'
    "></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class KubernetesDashboardNoKongProxyComponent {}
