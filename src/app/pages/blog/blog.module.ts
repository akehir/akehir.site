import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { EntriesComponent } from './entries.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      { path: '', component: EntriesComponent },
      {
        path: 'hello-world',
        loadComponent: () =>
          import('./entries/hello-world.component').then(
            c => c.HelloWorldComponent
          ),
      },
      {
        path: 'chromeos-wireguard',
        loadComponent: () =>
          import('./entries/chromeos-wireguard.component').then(
            c => c.ChromeOSWireGuardComponent
          ),
      },
      {
        path: 'git-reset',
        loadComponent: () =>
          import('./entries/git-reset.component').then(
            c => c.GitResetComponent
          ),
      },
      {
        path: 'kubernetes-dashboard-no-kong-proxy',
        loadComponent: () =>
          import('./entries/kubernetes-dashboard-no-kong-proxy.component').then(
            c => c.KubernetesDashboardNoKongProxyComponent
          ),
      },
      {
        path: 'llama-cpp-docker-rocm',
        loadComponent: () =>
          import('./entries/llama-cpp-docker-rocm.component').then(
            c => c.LlamaCppDockerRocmComponent
          ),
      },
      {
        path: 'mistral-3-1',
        loadComponent: () =>
          import('./entries/mistral-3-1.component').then(
            c => c.Mistral31Component
          ),
      },
      {
        path: 'rid-google-ai-overview',
        loadComponent: () =>
          import('./entries/rid-google-ai-overview.component').then(
            c => c.RidGoogleAIOverviewComponent
          ),
      },
      {
        path: 'stable-diffusion-docker-rocm',
        loadComponent: () =>
          import('./entries/stable-diffusion-docker-rocm.component').then(
            c => c.StableDiffusionDockerRocmComponent
          ),
      },
      {
        path: 'ssh-wireguard-mobile-hotspot-issue',
        loadComponent: () =>
          import('./entries/ssh-wireguard-mobile-hotspot-issue.component').then(
            c => c.SSHWireguardMobileHotspotIssueComponent
          ),
      },
      {
        path: 'traefik-ingress-logs',
        loadComponent: () =>
          import('./entries/traefik-ingress-logs.component').then(
            c => c.TraefikIngressLogsComponent
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    BlogComponent,
    EntriesComponent,
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class BlogModule {}
