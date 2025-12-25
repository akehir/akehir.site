import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { EntriesComponent } from './entries.component';

export type EntryCategory =
  | 'Android'
  | 'ChromeOS'
  | 'Linux'
  | 'Meta'
  | 'Machine Learning'
  | 'Software'
  | 'Infrastructure'
  | 'Gaming'
  | 'Fonduest Memories'
  | 'Travel'
  | "Raphael's Random Rumblings"
  | 'Programming'
  | 'Kubernetes'
  | 'Reading'
  | 'Hardware'
  | 'git'
  | 'Docker'
  | 'Self-Hosting';

export type BlogData = {
  title: string;
  routerLink: string;
  content: string;
  source: string;
  publishedDate: string;
  modifiedDate: string;
  author: 'Raphael Ochsenbein';
  mainCategory: EntryCategory;
  categories: EntryCategory[];
  hidden?: true;
};

type BlogRoute = Route & { data: BlogData };

export const blogEntries: BlogRoute[] = [
  {
    path: 'flux-kontext-docker-rocm-webui',
    title: '',
    data: {
      title: '',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', 'Docker'],
      mainCategory: 'Machine Learning',
      publishedDate: '2025-12-25',
      modifiedDate: '2025-12-25',
      routerLink: '/blog/flux-kontext-docker-rocm-webui',
      content: '/assets/blog/flux-kontext-docker-rocm-webui.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/flux-kontext-docker-rocm-webui.md',
    },
    loadComponent: () =>
      import('./entries/flux-kontext-docker-rocm-webui.component').then(
        c => c.FluxKontextDockerRocmWebuiComponent
      ),
  },
  {
    path: 'llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models',
    title:
      'Using llama-swap to Self-Host an OpenAI Compatible API with llama.cpp providing Multiple LLM Models with Limited Resources',
    data: {
      title:
        'Using llama-swap to Self-Host an OpenAI Compatible API with llama.cpp providing Multiple LLM Models with Limited Resources',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', 'Self-Hosting'],
      mainCategory: 'Machine Learning',
      publishedDate: '2025-10-23',
      modifiedDate: '2025-10-23',
      routerLink:
        '/blog/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models',
      content:
        '/assets/blog/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models.md',
    },
    loadComponent: () =>
      import(
        './entries/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models.component'
      ).then(
        c => c.LlamaSwapAndLlamaCppForSelfHostingMultipleLlmModelsComponent
      ),
  },
  {
    path: 'lenovo-chromebook-plus-14',
    title:
      'Lenovo Chromebook Plus 14 - First Impressions, and Preliminary Review',
    data: {
      title:
        'Lenovo Chromebook Plus 14 - First Impressions, and Preliminary Review',
      author: 'Raphael Ochsenbein',
      categories: ['ChromeOS', 'Hardware'],
      mainCategory: 'Hardware',
      publishedDate: '2025-09-29',
      modifiedDate: '2025-09-29',
      routerLink: '/blog/lenovo-chromebook-plus-14',
      content: '/assets/blog/lenovo-chromebook-plus-14.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/lenovo-chromebook-plus-14.md',
    },
    loadComponent: () =>
      import('./entries/lenovo-chromebook-plus-14.component').then(
        c => c.LenovoChromebookPlus14Component
      ),
  },
  {
    path: 'lenovo-ideapad-duet-5-chromebook',
    title: 'Lenovo IdeaPad Duet 5 Chromebook Gen 6 (13" QCOM) - Review',
    data: {
      title: 'Lenovo IdeaPad Duet 5 Chromebook Gen 6 (13" QCOM) - Review',
      author: 'Raphael Ochsenbein',
      categories: ['ChromeOS', 'Hardware'],
      mainCategory: 'Hardware',
      publishedDate: '2025-09-29',
      modifiedDate: '2025-09-29',
      routerLink: '/blog/lenovo-ideapad-duet-5-chromebook',
      content: '/assets/blog/lenovo-ideapad-duet-5-chromebook.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/lenovo-ideapad-duet-5-chromebook.md',
    },
    loadComponent: () =>
      import('./entries/lenovo-ideapad-duet-5-chromebook.component').then(
        c => c.LenovoIdeapadDuet5ChromebookComponent
      ),
  },
  {
    path: 'chromeos-remote-debugging-firefox',
    title:
      'ChromeOS - Remote Debugging with Firefox on an Android Phone via Crostini on ChromeOS',
    data: {
      title:
        'ChromeOS - Remote Debugging with Firefox on an Android Phone via Crostini on ChromeOS',
      author: 'Raphael Ochsenbein',
      categories: ['ChromeOS', 'Programming'],
      mainCategory: 'ChromeOS',
      publishedDate: '2025-09-19',
      modifiedDate: '2025-09-19',
      routerLink: '/blog/chromeos-remote-debugging-firefox',
      content: '/assets/blog/chromeos-remote-debugging-firefox.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/chromeos-remote-debugging-firefox.md',
    },
    loadComponent: () =>
      import('./entries/chromeos-remote-debugging-firefox.component').then(
        c => c.ChromeosRemoteDebuggingFirefoxComponent
      ),
  },
  {
    path: 'algovernmentality',
    title: 'Algovernmentality',
    data: {
      title: 'Algovernmentality',
      author: 'Raphael Ochsenbein',
      categories: ["Raphael's Random Rumblings", 'Programming'],
      mainCategory: "Raphael's Random Rumblings",
      publishedDate: '2014-11-25',
      modifiedDate: '2014-11-25',
      routerLink: '/blog/algovernmentality',
      content: '/assets/blog/algovernmentality.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/algovernmentality.md',
    },
    loadComponent: () =>
      import('./entries/algovernmentality.component').then(
        c => c.AlgovernmentalityComponent
      ),
  },
  {
    path: 'hello-world',
    title: 'Hello World!',
    data: {
      title: 'Hello World!',
      routerLink: '/blog/hello-world',
      content: '/assets/blog/hello-world.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/hello-world.md',
      publishedDate: '2007-01-08',
      modifiedDate: '2025-09-19',
      author: 'Raphael Ochsenbein',
      mainCategory: "Raphael's Random Rumblings",
      categories: ["Raphael's Random Rumblings", 'Programming'],
    },
    loadComponent: () =>
      import('./entries/hello-world.component').then(
        c => c.HelloWorldComponent
      ),
  },
  {
    path: 'chromeos-wireguard',
    title: 'How to Setup the Built-In WireGuard VPN in ChromeOS',
    data: {
      title: 'How to Setup the Built-In WireGuard VPN in ChromeOS',
      routerLink: '/blog/chromeos-wireguard',
      content: '/assets/blog/chromeos-wireguard.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/chromeos-wireguard.md',
      publishedDate: '2025-04-13',
      modifiedDate: '2025-04-13',
      author: 'Raphael Ochsenbein',
      mainCategory: 'ChromeOS',
      categories: ['ChromeOS'],
    },
    loadComponent: () =>
      import('./entries/chromeos-wireguard.component').then(
        c => c.ChromeOSWireGuardComponent
      ),
  },
  {
    path: 'cool-things-with-transformers-in-the-browser',
    title: 'Cool things with Transformers in the Browser',
    data: {
      title: 'Cool things with Transformers in the Browser',
      routerLink: '/blog/cool-things-with-transformers-in-the-browser',
      content: '',
      source: '',
      publishedDate: '',
      modifiedDate: '',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning'],
      hidden: true,
    },
    loadComponent: () =>
      import(
        './entries/cool-things-with-transformers-in-the-browser.component'
      ).then(c => c.CoolThingsWithTransformersInTheBrowserComponent),
  },
  {
    path: 'git-reset',
    title: 'git reset ',
    data: {
      title: 'git reset',
      routerLink: '/blog/git-reset',
      content: '/assets/blog/git-reset.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/git-reset.md',
      publishedDate: '2025-03-20',
      modifiedDate: '2025-03-20',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Programming',
      categories: ['Programming', 'git'],
    },
    loadComponent: () =>
      import('./entries/git-reset.component').then(c => c.GitResetComponent),
  },
  {
    path: 'filebeat-crashloopbackoff',
    title:
      'How to fix filebeat CrashLoopBackoff (due to OOMKiller) by increasing resource limits',
    data: {
      title:
        'How to fix filebeat CrashLoopBackoff (due to OOMKiller) by increasing resource limits',
      routerLink: '/blog/filebeat-crashloopbackoff',
      content: '/assets/blog/filebeat-crashloopbackoff.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/filebeat-crashloopbackoff.md',
      publishedDate: '2025-04-25',
      modifiedDate: '2025-04-25',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure', 'Self-Hosting', 'Kubernetes'],
    },
    loadComponent: () =>
      import('./entries/filebeat-crashloopbackoff.component').then(
        c => c.FileBeatCrashLoopBackOffComponent
      ),
  },
  {
    path: 'how-to-make-your-homelab-accessible-via-pangolin',
    title: 'How to make your Homelab Accessible via Pangolin',
    data: {
      title: 'How to make your Homelab Accessible via Pangolin',
      routerLink: '/blog/how-to-make-your-homelab-accessible-via-pangolin',
      content: '/assets/blog/pangolin-basics.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/pangolin-basics.md',
      publishedDate: '2025-07-17',
      modifiedDate: '2025-12-25',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure'],
    },
    loadComponent: () =>
      import('./entries/pangolin-basics.component').then(
        c => c.PangolinBasicsComponent
      ),
  },
  {
    path: 'https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak',
    title:
      'How to do a HTTPS Redirect with Kubernetes Traefik Ingress and get automatic HTTPS Certificates with LetsEncrypt and Infomaniak with a ClusterIssuer',
    data: {
      title:
        'How to do a HTTPS Redirect with Kubernetes Traefik Ingress and get automatic HTTPS Certificates with LetsEncrypt and Infomaniak with a ClusterIssuer',
      routerLink:
        '/blog/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak',
      content:
        '/assets/blog/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.md',
      publishedDate: '2025-04-25',
      modifiedDate: '2025-04-25',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure', 'Self-Hosting', 'Kubernetes'],
    },
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
    data: {
      title:
        'Kubernetes Dashboard without Kong Proxy (nginx bind to port 8444 failed)',
      routerLink: '/blog/kubernetes-dashboard-no-kong-proxy',
      content: '/assets/blog/kubernetes-dashboard-no-kong-proxy.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/kubernetes-dashboard-no-kong-proxy.md',
      publishedDate: '2025-04-15',
      modifiedDate: '2025-04-15',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure', 'Self-Hosting', 'Kubernetes'],
    },
    loadComponent: () =>
      import('./entries/kubernetes-dashboard-no-kong-proxy.component').then(
        c => c.KubernetesDashboardNoKongProxyComponent
      ),
  },
  {
    path: 'llama-cpp-docker-rocm',
    title:
      'How to run DeepSeek R1 with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX',
    data: {
      title:
        'How to run DeepSeek R1 with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX',
      routerLink: '/blog/llama-cpp-docker-rocm',
      content: '/assets/blog/llama-cpp-docker-rocm.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/llama-cpp-docker-rocm.md',
      publishedDate: '2025-02-28',
      modifiedDate: '2025-02-28',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/llama-cpp-docker-rocm.component').then(
        c => c.LlamaCppDockerRocmComponent
      ),
  },
  {
    path: 'llama-cpp-docker-rocm-gpt-oss',
    title:
      'How to run GPT-OSS (20B and 120B) with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900 XTX and AMD Ryzen 9 7950X',
    data: {
      title:
        'How to run GPT-OSS (20B and 120B) with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900 XTX and AMD Ryzen 9 7950X',
      routerLink: '/blog/llama-cpp-docker-rocm-gpt-oss',
      content: '/assets/blog/llama-cpp-docker-rocm-gpt-oss.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/llama-cpp-docker-rocm-gpt-oss.md',
      publishedDate: '2025-08-28',
      modifiedDate: '2025-08-28',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/llama-cpp-docker-rocm-gpt-oss.component').then(
        c => c.LlamaCppDockerRocmGptOssComponent
      ),
  },
  {
    path: 'mistral-3-1',
    title:
      'How to run Mistral-Small-3.1-24B with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX',
    data: {
      title:
        'How to run Mistral-Small-3.1-24B with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX',
      routerLink: '/blog/mistral-3-1',
      content: '/assets/blog/mistral-3-1.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/mistral-3-1.md',
      publishedDate: '2025-03-23',
      modifiedDate: '2025-03-23',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/mistral-3-1.component').then(c => c.Mistral31Component),
  },
  {
    path: 'open-webui-llama-server',
    title:
      'How to Self-Host your own private ChatGPT: Open WebUI with a GPU Accelerated llama.cpp Backend and the OpenAI GPT-20B Model',
    data: {
      title:
        'How to Self-Host your own private ChatGPT: Open WebUI with a GPU Accelerated llama.cpp Backend and the OpenAI GPT-20B Model',
      routerLink: '/blog/open-webui-llama-server',
      content: '/assets/blog/open-webui-llama-server.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/open-webui-llama-server.md',
      publishedDate: '2025-09-09',
      modifiedDate: '2025-09-09',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Self-Hosting',
      categories: ['Self-Hosting', 'Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/open-webui-llama-server.component').then(
        c => c.OpenWebuiLlamaServerComponent
      ),
  },
  {
    path: 'rid-google-ai-overview',
    title: 'How to get rid of AI Overviews in Google search',
    data: {
      title: 'How to get rid of AI Overviews in Google search',
      routerLink: '/blog/rid-google-ai-overview',
      content: '/assets/blog/rid-google-ai-overview.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/rid-google-ai-overview.md',
      publishedDate: '2025-03-28',
      modifiedDate: '2025-03-28',
      author: 'Raphael Ochsenbein',
      mainCategory: "Raphael's Random Rumblings",
      categories: ["Raphael's Random Rumblings", 'Machine Learning'],
    },
    loadComponent: () =>
      import('./entries/rid-google-ai-overview.component').then(
        c => c.RidGoogleAIOverviewComponent
      ),
  },
  {
    path: 'stable-diffusion-docker-rocm',
    title:
      'How to run Stable Diffusion WebUI or Forge on AMD Radeon RX 7900XTX via Docker on Linux on Debian with ROCm 6.2 and GPU Acceleration',
    data: {
      title:
        'How to run Stable Diffusion WebUI or Forge on AMD Radeon RX 7900XTX via Docker on Linux on Debian with ROCm 6.2 and GPU Acceleration',
      routerLink: '/blog/stable-diffusion-docker-rocm',
      content: '/assets/blog/stable-diffusion-docker-rocm.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/stable-diffusion-docker-rocm.md',
      publishedDate: '2025-02-28',
      modifiedDate: '2025-02-28',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/stable-diffusion-docker-rocm.component').then(
        c => c.StableDiffusionDockerRocmComponent
      ),
  },
  {
    path: 'ssh-wireguard-mobile-hotspot-issue',
    title:
      'How to Fix SSH (and git) Not Working Over Wireguard on Mobile Hotspot',
    data: {
      title:
        'How to Fix SSH (and git) Not Working Over Wireguard on Mobile Hotspot',
      routerLink: '/blog/ssh-wireguard-mobile-hotspot-issue',
      content: '/assets/blog/ssh-wireguard-mobile-hotspot-issue.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/ssh-wireguard-mobile-hotspot-issue.md',
      publishedDate: '2025-03-06',
      modifiedDate: '2025-03-06',
      author: 'Raphael Ochsenbein',
      mainCategory: 'ChromeOS',
      categories: ['ChromeOS', 'Linux'],
    },
    loadComponent: () =>
      import('./entries/ssh-wireguard-mobile-hotspot-issue.component').then(
        c => c.SSHWireguardMobileHotspotIssueComponent
      ),
  },
  {
    path: 'synology-dsm-port-443',
    title: 'How to Map Port 443 to DSM on Synology NAS',
    data: {
      title: 'How to Map Port 443 to DSM on Synology NAS',
      routerLink: '/blog/synology-dsm-port-443',
      content: '/assets/blog/synology-dsm-port-443.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/synology-dsm-port-443.md',
      publishedDate: '2025-05-09',
      modifiedDate: '2025-05-09',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure'],
    },
    loadComponent: () =>
      import('./entries/synology-dsm-port-443.component').then(
        c => c.SynologyDSMPort443Component
      ),
  },
  {
    path: 'traefik-ingress-logs',
    title:
      'Debugging Kubernetes Traefik Ingress Issues by Reading the Traefik Logs',
    data: {
      title:
        'Debugging Kubernetes Traefik Ingress Issues by Reading the Traefik Logs',
      routerLink: '/blog/traefik-ingress-logs',
      content: '/assets/blog/traefik-ingress-logs.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/traefik-ingress-logs.md',
      publishedDate: '2025-04-13',
      modifiedDate: '2025-04-13',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Self-Hosting',
      categories: ['Self-Hosting', 'Infrastructure', 'Kubernetes'],
    },
    loadComponent: () =>
      import('./entries/traefik-ingress-logs.component').then(
        c => c.TraefikIngressLogsComponent
      ),
  },
];

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [{ path: '', component: EntriesComponent }, ...blogEntries],
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
