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
        title: 'Hello World!',
        loadComponent: () =>
          import('./entries/hello-world.component').then(
            c => c.HelloWorldComponent
          ),
      },
      {
        path: 'chromeos-wireguard',
        title: 'How to Setup the Built-In WireGuard VPN in ChromeOS',
        loadComponent: () =>
          import('./entries/chromeos-wireguard.component').then(
            c => c.ChromeOSWireGuardComponent
          ),
      },
      {
        path: 'cool-things-with-transformers-in-the-browser',
        title: 'Cool things with Transformers in the Browser',
        loadComponent: () =>
          import(
            './entries/cool-things-with-transformers-in-the-browser.component'
          ).then(c => c.CoolThingsWithTransformersInTheBrowserComponent),
      },
      {
        path: 'git-reset',
        title: 'git reset ',
        loadComponent: () =>
          import('./entries/git-reset.component').then(
            c => c.GitResetComponent
          ),
      },
      {
        path: 'filebeat-crashloopbackoff',
        title:
          'How to fix filebeat CrashLoopBackoff (due to OOMKiller) by increasing resource limits',
        loadComponent: () =>
          import('./entries/filebeat-crashloopbackoff.component').then(
            c => c.FileBeatCrashLoopBackOffComponent
          ),
      },
      {
        path: 'how-to-make-your-homelab-accessible-via-pangolin',
        title: 'How to make your Homelab Accessible via Pangolin',
        loadComponent: () =>
          import('./entries/pangolin-basics.component').then(
            c => c.PangolinBasicsComponent
          ),
      },
      {
        path: 'https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak',
        title:
          'How to do a HTTPS Redirect with Kubernetes Traefik Ingress and get automatic HTTPS Certificates with LetsEncrypt and Infomaniak with a ClusterIssuer',
        loadComponent: () =>
          import(
            './entries/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.component'
          ).then(
            c =>
              c.HttpsRedirectTraefikWithAutomaticCertificatesFromClusterIssuerWithInfomaniakComponent
          ),
      },
      {
        path: 'kubernetes-dashboard-no-kong-proxy',
        title:
          'Kubernetes Dashboard without Kong Proxy (nginx bind to port 8444 failed)',
        loadComponent: () =>
          import('./entries/kubernetes-dashboard-no-kong-proxy.component').then(
            c => c.KubernetesDashboardNoKongProxyComponent
          ),
      },
      {
        path: 'llama-cpp-docker-rocm',
        title:
          'How to run DeepSeek R1 with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX',
        loadComponent: () =>
          import('./entries/llama-cpp-docker-rocm.component').then(
            c => c.LlamaCppDockerRocmComponent
          ),
      },
      {
        path: 'llama-cpp-docker-rocm-gpt-oss',
        title:
          'How to run GPT-OSS (20B and 120B) with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900 XTX and AMD Ryzen 9 7950X',
        loadComponent: () =>
          import('./entries/llama-cpp-docker-rocm-gpt-oss.component').then(
            c => c.LlamaCppDockerRocmGptOssComponent
          ),
      },
      {
        path: 'mistral-3-1',
        title:
          'How to run Mistral-Small-3.1-24B with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX',
        loadComponent: () =>
          import('./entries/mistral-3-1.component').then(
            c => c.Mistral31Component
          ),
      },
      {
        path: 'open-webui-llama-server',
        title:
          'How to Self-Host your own private ChatGPT: Open WebUI with a GPU Accelerated llama.cpp Backend and the OpenAI GPT-20B Model',
        loadComponent: () =>
          import('./entries/open-webui-llama-server.component').then(
            c => c.OpenWebuiLlamaServerComponent
          ),
      },
      {
        path: 'rid-google-ai-overview',
        title: 'How to get rid of AI Overviews in Google search',
        loadComponent: () =>
          import('./entries/rid-google-ai-overview.component').then(
            c => c.RidGoogleAIOverviewComponent
          ),
      },
      {
        path: 'stable-diffusion-docker-rocm',
        title:
          'How to run Stable Diffusion WebUI or Forge on AMD Radeon RX 7900XTX via Docker on Linux on Debian with ROCm 6.2 and GPU Acceleration',
        loadComponent: () =>
          import('./entries/stable-diffusion-docker-rocm.component').then(
            c => c.StableDiffusionDockerRocmComponent
          ),
      },
      {
        path: 'ssh-wireguard-mobile-hotspot-issue',
        title:
          'How to Fix SSH (and git) Not Working Over Wireguard on Mobile Hotspot',
        loadComponent: () =>
          import('./entries/ssh-wireguard-mobile-hotspot-issue.component').then(
            c => c.SSHWireguardMobileHotspotIssueComponent
          ),
      },
      {
        path: 'synology-dsm-port-443',
        title: 'How to Map Port 443 to DSM on Synology NAS',
        loadComponent: () =>
          import('./entries/synology-dsm-port-443.component').then(
            c => c.SynologyDSMPort443Component
          ),
      },
      {
        path: 'traefik-ingress-logs',
        title:
          'Debugging Kubernetes Traefik Ingress Issues by Reading the Traefik Logs',
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
