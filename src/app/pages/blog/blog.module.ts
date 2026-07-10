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
  | 'CyberSecurity'
  | 'Kubernetes'
  | 'Reading'
  | 'Hardware'
  | 'git'
  | 'Docker'
  | 'Self-Hosting';

export interface BlogData {
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
}

type BlogRoute = Route & { data: BlogData };

export const blogEntries: BlogRoute[] = [
  {
    path: 'the-photography-parable-and-programming',
    title: 'The Photography Parable, and Programming LLMs',
    data: {
      title: 'The Photography Parable, and Programming LLMs',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', "Raphael's Random Rumblings"],
      mainCategory: 'Machine Learning',
      publishedDate: '2026-07-11',
      modifiedDate: '2026-07-11',
      routerLink: '/blog/the-photography-parable-and-programming',
      content: '/assets/blog/2026/the-photography-parable-and-programming.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/the-photography-parable-and-programming.md',
    },
    loadComponent: () =>
      import('./entries/2026/the-photography-parable-and-programming.component').then(
        c => c.ThePhotographyParableAndProgrammingComponent
      ),
  },
  {
    path: 'code-monkey-code-basher',
    title: 'From Code Monkey to Code Basher',
    data: {
      title: 'From Code Monkey to Code Basher',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', "Raphael's Random Rumblings"],
      mainCategory: 'Machine Learning',
      publishedDate: '2026-07-07',
      modifiedDate: '2026-07-07',
      routerLink: '/blog/code-monkey-code-basher',
      content: '/assets/blog/2026/code-monkey-code-basher.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/code-monkey-code-basher.md',
    },
    loadComponent: () =>
      import('./entries/2026/code-monkey-code-basher.component').then(
        c => c.CodeMonkeyCodeBasherComponent
      ),
  },
  {
    path: 'init-7',
    title: 'Internet Service Provider Recommendation: Init7 (Fiber7)',
    data: {
      title: 'Internet Service Provider Recommendation: Init7 (Fiber7)',
      author: 'Raphael Ochsenbein',
      categories: ['Infrastructure'],
      mainCategory: 'Infrastructure',
      publishedDate: '2026-06-08',
      modifiedDate: '2026-06-08',
      routerLink: '/blog/init-7',
      content: '/assets/blog/2026/init-7.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/init-7.md',
    },
    loadComponent: () =>
      import('./entries/2026/init-7.component').then(c => c.Init7Component),
  },
  {
    path: 'global-cyber-skills-benchmark-ctf-2026',
    title:
      'Global Cyber Skills Benchmark CTF 2026 - Solving the Hard AI Challenge (Espionage Intelligence)',
    data: {
      title:
        'Global Cyber Skills Benchmark CTF 2026 - Solving the Hard AI Challenge (Espionage Intelligence)',
      author: 'Raphael Ochsenbein',
      categories: ['CyberSecurity'],
      mainCategory: 'CyberSecurity',
      publishedDate: '2026-06-08',
      modifiedDate: '2026-06-08',
      routerLink: '/blog/global-cyber-skills-benchmark-ctf-2026',
      content: '/assets/blog/2026/global-cyber-skills-benchmark-ctf-2026.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/global-cyber-skills-benchmark-ctf-2026.md',
    },
    loadComponent: () =>
      import('./entries/2026/global-cyber-skills-benchmark-ctf-2026.component').then(
        c => c.GlobalCyberSkillsBenchmarkCtf2026Component
      ),
  },
  {
    path: 'gemma-4-qat',
    title: 'Quick Review of the Gemma 4 QAT Models',
    data: {
      title: 'Quick Review of the Gemma 4 QAT Models',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning'],
      mainCategory: 'Machine Learning',
      publishedDate: '2026-06-08',
      modifiedDate: '2026-06-08',
      routerLink: '/blog/gemma-4-qat',
      content: '/assets/blog/2026/gemma-4-qat.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/gemma-4-qat.md',
    },
    loadComponent: () =>
      import('./entries/2026/gemma-4-qat.component').then(
        c => c.Gemma4QatComponent
      ),
  },
  {
    path: 'strix-halo-kubernetes-llm-qwen-3.6',
    title:
      'Qwen 3.6 35B A3B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan with Kubernetes',
    data: {
      title:
        'Qwen 3.6 35B A3B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan with Kubernetes',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', 'Docker', 'Kubernetes'],
      mainCategory: 'Machine Learning',
      publishedDate: '2026-04-19',
      modifiedDate: '2026-04-19',
      routerLink: '/blog/strix-halo-kubernetes-llm-qwen-3.6',
      content: '/assets/blog/2026/strix-halo-kubernetes-llm-qwen-3.6.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/strix-halo-kubernetes-llm-qwen-3.6.md',
    },
    loadComponent: () =>
      import('./entries/2026/strix-halo-kubernetes-llm-qwen-3.6.component').then(
        c => c.StrixHaloKubernetesLlmQwen3_6Component
      ),
  },
  {
    path: 'strix-halo-kubernetes-llm-gemma-4',
    title:
      'Gemma 4 31B, 26B, and E4B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan (or ROCm) with Kubernetes (or Docker)',
    data: {
      title:
        'Gemma 4 31B, 26B, and E4B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan (or ROCm) with Kubernetes (or Docker)',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', 'Docker', 'Kubernetes'],
      mainCategory: 'Machine Learning',
      publishedDate: '2026-04-04',
      modifiedDate: '2026-04-19',
      routerLink: '/blog/strix-halo-kubernetes-llm-gemma-4',
      content: '/assets/blog/2026/strix-halo-kubernetes-llm-gemma-4.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/strix-halo-kubernetes-llm-gemma-4.md',
    },
    loadComponent: () =>
      import('./entries/2026/strix-halo-kubernetes-llm-gemma-4.component').then(
        c => c.StrixHaloKubernetesLlmGemma4Component
      ),
  },
  {
    path: 'sealed-secrets',
    title: 'Using Bitnami Sealed Secrets with Flux on Kubernetes',
    data: {
      title: 'Using Bitnami Sealed Secrets with Flux on Kubernetes',
      author: 'Raphael Ochsenbein',
      categories: [
        'Self-Hosting',
        'Meta',
        'Infrastructure',
        'Kubernetes',
        'Software',
        'Programming',
      ],
      mainCategory: 'Infrastructure',
      publishedDate: '2026-02-22',
      modifiedDate: '2026-02-22',
      routerLink: '/blog/sealed-secrets',
      content: '/assets/blog/2026/sealed-secrets.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/sealed-secrets.md',
    },
    loadComponent: () =>
      import('./entries/2026/sealed-secrets.component').then(
        c => c.SealedSecretsComponent
      ),
  },
  {
    path: '2025-review',
    title: '2025 in Review',
    data: {
      title: '2025 in Review',
      author: 'Raphael Ochsenbein',
      categories: ["Raphael's Random Rumblings", 'Meta'],
      mainCategory: "Raphael's Random Rumblings",
      publishedDate: '2026-02-22',
      modifiedDate: '2026-02-22',
      routerLink: '/blog/2025-review',
      content: '/assets/blog/2025/2025-review.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/2025-review.md',
    },
    loadComponent: () =>
      import('./entries/2025/2025-review.component').then(
        c => c.TwentyTwentyFiveReviewComponent
      ),
  },
  {
    path: 'brutalist',
    title: 'Why is My Website a Brutalist Mess?',
    data: {
      title: 'Why is My Website a Brutalist Mess?',
      author: 'Raphael Ochsenbein',
      categories: ["Raphael's Random Rumblings", 'Programming'],
      mainCategory: "Raphael's Random Rumblings",
      publishedDate: '2026-01-17',
      modifiedDate: '2026-01-17',
      routerLink: '/blog/brutalist',
      content: '/assets/blog/2026/brutalist.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/brutalist.md',
    },
    loadComponent: () =>
      import('./entries/2026/brutalist.component').then(
        c => c.BrutalistComponent
      ),
  },
  {
    path: '2025-homelab',
    title: 'The State of My HomeLab in 2025',
    data: {
      title: 'The State of My HomeLab in 2025',
      author: 'Raphael Ochsenbein',
      categories: [
        'Self-Hosting',
        'Meta',
        'Infrastructure',
        'Kubernetes',
        'Software',
        'Programming',
      ],
      mainCategory: 'Self-Hosting',
      publishedDate: '2026-01-08',
      modifiedDate: '2026-01-08',
      routerLink: '/blog/2025-homelab',
      content: '/assets/blog/2025/2025-homelab.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/2025-homelab.md',
    },
    loadComponent: () =>
      import('./entries/2025/2025-homelab.component').then(
        c => c.TwentyTwentyFiveHomelabComponent
      ),
  },
  {
    path: '2025-gaming',
    title: 'Gaming: 2025 in Review',
    data: {
      title: 'Gaming: 2025 in Review',
      author: 'Raphael Ochsenbein',
      categories: ['Gaming', 'Linux', 'Meta'],
      mainCategory: 'Gaming',
      publishedDate: '2026-01-08',
      modifiedDate: '2026-01-08',
      routerLink: '/blog/2025-gaming',
      content: '/assets/blog/2025/2025-gaming.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/2025-gaming.md',
    },
    loadComponent: () =>
      import('./entries/2025/2025-gaming.component').then(
        c => c.TwentyTwentyFiveGamingComponent
      ),
  },
  {
    path: 'no-ai-generated-blog-posts',
    title: 'No AI Generated Blog Posts',
    data: {
      title: 'No AI Generated Blog Posts',
      author: 'Raphael Ochsenbein',
      categories: ["Raphael's Random Rumblings", 'Meta', 'Machine Learning'],
      mainCategory: "Raphael's Random Rumblings",
      publishedDate: '2026-01-08',
      modifiedDate: '2026-01-08',
      routerLink: '/blog/no-ai-generated-blog-posts',
      content: '/assets/blog/2026/no-ai-generated-blog-posts.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/no-ai-generated-blog-posts.md',
    },
    loadComponent: () =>
      import('./entries/2026/no-ai-generated-blog-posts.component').then(
        c => c.NoAiGeneratedBlogPostsComponent
      ),
  },
  {
    path: 'strix-halo-kubernetes-llm-gpt-oss',
    title:
      'GPT-OSS 120B & 20B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan with Kubernetes',
    data: {
      title:
        'GPT-OSS 120B & 20B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan with Kubernetes',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', 'Docker', 'Kubernetes'],
      mainCategory: 'Machine Learning',
      publishedDate: '2025-12-25',
      modifiedDate: '2026-04-19',
      routerLink: '/blog/strix-halo-kubernetes-llm-gpt-oss',
      content: '/assets/blog/2026/strix-halo-kubernetes-llm-gpt-oss.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2026/strix-halo-kubernetes-llm-gpt-oss.md',
    },
    loadComponent: () =>
      import('./entries/2026/strix-halo-kubernetes-llm-gpt-oss.component').then(
        c => c.StrixHaloKubernetesLlmGptOssComponent
      ),
  },
  {
    path: 'flux-kontext-docker-rocm-webui',
    title:
      'Running Flux Kontext and Flux Krea on an AMD RX-7900XTX 24GB GPU Locally via ROCm and Stable-Diffusion-WebUI-Forge',
    data: {
      title:
        'Running Flux Kontext and Flux Krea on an AMD RX-7900XTX 24GB GPU Locally via ROCm and Stable-Diffusion-WebUI-Forge',
      author: 'Raphael Ochsenbein',
      categories: ['Machine Learning', 'Docker'],
      mainCategory: 'Machine Learning',
      publishedDate: '2025-12-25',
      modifiedDate: '2025-12-25',
      routerLink: '/blog/flux-kontext-docker-rocm-webui',
      content: '/assets/blog/2025/flux-kontext-docker-rocm-webui.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/flux-kontext-docker-rocm-webui.md',
    },
    loadComponent: () =>
      import('./entries/2025/flux-kontext-docker-rocm-webui.component').then(
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
        '/assets/blog/2025/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models.md',
    },
    loadComponent: () =>
      import('./entries/2025/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models.component').then(
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
      content: '/assets/blog/2025/lenovo-chromebook-plus-14.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/lenovo-chromebook-plus-14.md',
    },
    loadComponent: () =>
      import('./entries/2025/lenovo-chromebook-plus-14.component').then(
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
      content: '/assets/blog/2025/lenovo-ideapad-duet-5-chromebook.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/lenovo-ideapad-duet-5-chromebook.md',
    },
    loadComponent: () =>
      import('./entries/2025/lenovo-ideapad-duet-5-chromebook.component').then(
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
      content: '/assets/blog/2025/chromeos-remote-debugging-firefox.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/chromeos-remote-debugging-firefox.md',
    },
    loadComponent: () =>
      import('./entries/2025/chromeos-remote-debugging-firefox.component').then(
        c => c.ChromeosRemoteDebuggingFirefoxComponent
      ),
  },
  {
    path: 'chromeos-wireguard',
    title: 'How to Setup the Built-In WireGuard VPN in ChromeOS',
    data: {
      title: 'How to Setup the Built-In WireGuard VPN in ChromeOS',
      routerLink: '/blog/chromeos-wireguard',
      content: '/assets/blog/2025/chromeos-wireguard.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/chromeos-wireguard.md',
      publishedDate: '2025-04-13',
      modifiedDate: '2025-04-13',
      author: 'Raphael Ochsenbein',
      mainCategory: 'ChromeOS',
      categories: ['ChromeOS'],
    },
    loadComponent: () =>
      import('./entries/2025/chromeos-wireguard.component').then(
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
      import('./entries/2025/cool-things-with-transformers-in-the-browser.component').then(
        c => c.CoolThingsWithTransformersInTheBrowserComponent
      ),
  },
  {
    path: 'git-reset',
    title: 'git reset ',
    data: {
      title: 'git reset',
      routerLink: '/blog/git-reset',
      content: '/assets/blog/2025/git-reset.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/git-reset.md',
      publishedDate: '2025-03-20',
      modifiedDate: '2025-03-20',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Programming',
      categories: ['Programming', 'git'],
    },
    loadComponent: () =>
      import('./entries/2025/git-reset.component').then(
        c => c.GitResetComponent
      ),
  },
  {
    path: 'filebeat-crashloopbackoff',
    title:
      'How to fix filebeat CrashLoopBackoff (due to OOMKiller) by increasing resource limits',
    data: {
      title:
        'How to fix filebeat CrashLoopBackoff (due to OOMKiller) by increasing resource limits',
      routerLink: '/blog/filebeat-crashloopbackoff',
      content: '/assets/blog/2025/filebeat-crashloopbackoff.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/filebeat-crashloopbackoff.md',
      publishedDate: '2025-04-25',
      modifiedDate: '2025-04-25',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure', 'Self-Hosting', 'Kubernetes'],
    },
    loadComponent: () =>
      import('./entries/2025/filebeat-crashloopbackoff.component').then(
        c => c.FileBeatCrashLoopBackOffComponent
      ),
  },
  {
    path: 'how-to-make-your-homelab-accessible-via-pangolin',
    title: 'How to make your Homelab Accessible via Pangolin',
    data: {
      title: 'How to make your Homelab Accessible via Pangolin',
      routerLink: '/blog/how-to-make-your-homelab-accessible-via-pangolin',
      content: '/assets/blog/2025/pangolin-basics.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/pangolin-basics.md',
      publishedDate: '2025-07-17',
      modifiedDate: '2025-12-25',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure'],
    },
    loadComponent: () =>
      import('./entries/2025/pangolin-basics.component').then(
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
        '/assets/blog/2025/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.md',
      publishedDate: '2025-04-25',
      modifiedDate: '2025-04-25',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure', 'Self-Hosting', 'Kubernetes'],
    },
    loadComponent: () =>
      import('./entries/2025/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak.component').then(
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
      content: '/assets/blog/2025/kubernetes-dashboard-no-kong-proxy.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/kubernetes-dashboard-no-kong-proxy.md',
      publishedDate: '2025-04-15',
      modifiedDate: '2025-04-15',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure', 'Self-Hosting', 'Kubernetes'],
    },
    loadComponent: () =>
      import('./entries/2025/kubernetes-dashboard-no-kong-proxy.component').then(
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
      content: '/assets/blog/2025/llama-cpp-docker-rocm.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/llama-cpp-docker-rocm.md',
      publishedDate: '2025-02-28',
      modifiedDate: '2025-02-28',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/2025/llama-cpp-docker-rocm.component').then(
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
      content: '/assets/blog/2025/llama-cpp-docker-rocm-gpt-oss.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/llama-cpp-docker-rocm-gpt-oss.md',
      publishedDate: '2025-08-28',
      modifiedDate: '2025-08-28',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/2025/llama-cpp-docker-rocm-gpt-oss.component').then(
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
      content: '/assets/blog/2025/mistral-3-1.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/2025/blog/mistral-3-1.md',
      publishedDate: '2025-03-23',
      modifiedDate: '2025-03-23',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/2025/mistral-3-1.component').then(
        c => c.Mistral31Component
      ),
  },
  {
    path: 'open-webui-llama-server',
    title:
      'How to Self-Host your own private ChatGPT: Open WebUI with a GPU Accelerated llama.cpp Backend and the OpenAI GPT-20B Model',
    data: {
      title:
        'How to Self-Host your own private ChatGPT: Open WebUI with a GPU Accelerated llama.cpp Backend and the OpenAI GPT-20B Model',
      routerLink: '/blog/open-webui-llama-server',
      content: '/assets/blog/2025/open-webui-llama-server.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/open-webui-llama-server.md',
      publishedDate: '2025-09-09',
      modifiedDate: '2025-09-09',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Self-Hosting',
      categories: ['Self-Hosting', 'Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/2025/open-webui-llama-server.component').then(
        c => c.OpenWebuiLlamaServerComponent
      ),
  },
  {
    path: 'rid-google-ai-overview',
    title: 'How to get rid of AI Overviews in Google search',
    data: {
      title: 'How to get rid of AI Overviews in Google search',
      routerLink: '/blog/rid-google-ai-overview',
      content: '/assets/blog/2025/rid-google-ai-overview.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/rid-google-ai-overview.md',
      publishedDate: '2025-03-28',
      modifiedDate: '2025-03-28',
      author: 'Raphael Ochsenbein',
      mainCategory: "Raphael's Random Rumblings",
      categories: ["Raphael's Random Rumblings", 'Machine Learning'],
    },
    loadComponent: () =>
      import('./entries/2025/rid-google-ai-overview.component').then(
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
      content: '/assets/blog/2025/stable-diffusion-docker-rocm.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/stable-diffusion-docker-rocm.md',
      publishedDate: '2025-02-28',
      modifiedDate: '2025-02-28',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Machine Learning',
      categories: ['Machine Learning', 'Docker'],
    },
    loadComponent: () =>
      import('./entries/2025/stable-diffusion-docker-rocm.component').then(
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
      content: '/assets/blog/2025/ssh-wireguard-mobile-hotspot-issue.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/ssh-wireguard-mobile-hotspot-issue.md',
      publishedDate: '2025-03-06',
      modifiedDate: '2025-03-06',
      author: 'Raphael Ochsenbein',
      mainCategory: 'ChromeOS',
      categories: ['ChromeOS', 'Linux'],
    },
    loadComponent: () =>
      import('./entries/2025/ssh-wireguard-mobile-hotspot-issue.component').then(
        c => c.SSHWireguardMobileHotspotIssueComponent
      ),
  },
  {
    path: 'synology-dsm-port-443',
    title: 'How to Map Port 443 to DSM on Synology NAS',
    data: {
      title: 'How to Map Port 443 to DSM on Synology NAS',
      routerLink: '/blog/synology-dsm-port-443',
      content: '/assets/blog/2025/synology-dsm-port-443.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/synology-dsm-port-443.md',
      publishedDate: '2025-05-09',
      modifiedDate: '2025-05-09',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Infrastructure',
      categories: ['Infrastructure'],
    },
    loadComponent: () =>
      import('./entries/2025/synology-dsm-port-443.component').then(
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
      content: '/assets/blog/2025/traefik-ingress-logs.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/blog/2025/traefik-ingress-logs.md',
      publishedDate: '2025-04-13',
      modifiedDate: '2025-04-13',
      author: 'Raphael Ochsenbein',
      mainCategory: 'Self-Hosting',
      categories: ['Self-Hosting', 'Infrastructure', 'Kubernetes'],
    },
    loadComponent: () =>
      import('./entries/2025/traefik-ingress-logs.component').then(
        c => c.TraefikIngressLogsComponent
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
      content: '/assets/blog/2014/algovernmentality.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/2014/blog/algovernmentality.md',
    },
    loadComponent: () =>
      import('./entries/2014/algovernmentality.component').then(
        c => c.AlgovernmentalityComponent
      ),
  },
  {
    path: 'hello-world',
    title: 'Hello World!',
    data: {
      title: 'Hello World!',
      routerLink: '/blog/hello-world',
      content: '/assets/blog/2007/hello-world.md',
      source:
        'https://git.akehir.com/akehir/akehir.site/-/blob/master/src/assets/2007/blog/hello-world.md',
      publishedDate: '2007-01-08',
      modifiedDate: '2025-09-19',
      author: 'Raphael Ochsenbein',
      mainCategory: "Raphael's Random Rumblings",
      categories: ["Raphael's Random Rumblings", 'Programming'],
    },
    loadComponent: () =>
      import('./entries/2007/hello-world.component').then(
        c => c.HelloWorldComponent
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
