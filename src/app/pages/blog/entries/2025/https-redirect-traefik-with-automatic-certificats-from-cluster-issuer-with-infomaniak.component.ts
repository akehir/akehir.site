import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2025/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.md?raw';

@Component({
  selector:
    'ake-blog-https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class HttpsRedirectTraefikWithAutomaticCertificatesFromClusterIssuerWithInfomaniakComponent {
  markdown = rawMarkdown;
}
