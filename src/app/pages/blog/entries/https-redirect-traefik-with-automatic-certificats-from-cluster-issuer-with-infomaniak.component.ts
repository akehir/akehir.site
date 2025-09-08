import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './entry.component';

@Component({
  selector:
    'ake-blog-https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak',
  template: ` <ake-blog-entry
    [src]="
      '/assets/blog/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.md'
    "></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class HttpsRedirectTraefikWithAutomaticCertificatesFromClusterIssuerWithInfomaniakComponent {}
