import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'ake-blog-https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak',
  template: `
    <markdown [src]="'/assets/blog/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.md'"></markdown>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownComponent,
  ],
})
export class HttpsRedirectTraefikWithAutomaticCertificatesFromClusterIssuerWithInfomaniakComponent {}
