import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

type EntryCategory = "Android" | "ChromeOS" | "Linux" | "Meta" | "Machine Learning" | "Software" | "Infrastructure" | "Gaming" | "Fonduest Memories" | "Travel" | "Raphael's Random Rumblings" | "Programming";

@Component({
  selector: 'ake-blog-entries',
  templateUrl: './entries.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
  ],
})
export class EntriesComponent {

  entries: {routerLink: string; title: string; category: EntryCategory }[] = [
    {
      routerLink: "/blog/how-to-make-your-homelab-accessible-via-pangolin",
      title: "How to make your Homelab Accessible via Pangolin",
      category: "Infrastructure",
    },
    {
      routerLink: "/blog/synology-dsm-port-443",
      title: "How to Map Port 443 to DSM on Synology NAS",
      category: "Infrastructure",
    },
    {
      routerLink: "/blog/https-redirect-traefik-with-automatic-certificats-from-cluster-issuer-with-infomaniak",
      title: "How to do a HTTPS Redirect with Kubernetes Traefik Ingress and get automatic HTTPS Certificates with LetsEncrypt and Infomaniak with a ClusterIssuer",
      category: "Infrastructure",
    },
    {
      routerLink: "/blog/filebeat-crashloopbackoff",
      title: "How to fix filebeat CrashLoopBackoff (due to OOMKiller) by increasing resource limits",
      category: "Infrastructure",
    },
    {
      routerLink: "/blog/kubernetes-dashboard-no-kong-proxy",
      title: "Kubernetes Dashboard without Kong Proxy (nginx bind to port 8444 failed)",
      category: "Infrastructure",
    },
    {
      routerLink: "/blog/traefik-ingress-logs",
      title: "Debugging Kubernetes Traefik Ingress Issues by Reading the Traefik Logs",
      category: "Infrastructure",
    },
    {
      routerLink: "/blog/chromeos-wireguard",
      title: "How to Setup the Built-In WireGuard VPN in ChromeOS",
      category: "ChromeOS",
    },
    {
      routerLink: "/blog/rid-google-ai-overview",
      title: "How to get rid of AI Overviews in Google search",
      category: "Machine Learning",
    },
    {
      routerLink: "/blog/mistral-3-1",
      title: "Mistral-Small-3.1-24B with llama.cpp on ROCm via Docker fully loaded into an RX 7900XTX",
      category: "Machine Learning",
    },
    {
      routerLink: "/blog/git-reset",
      title: "git reset",
      category: "Programming",
    },
    {
      routerLink: "/blog/llama-cpp-docker-rocm",
      title: "DeepSeek R1 with llama.cpp on ROCm via Docker",
      category: "Machine Learning",
    },
    {
      routerLink: "/blog/stable-diffusion-docker-rocm",
      title: "Stable Diffusion on ROCm via Docker",
      category: "Machine Learning",
    },
    {
      routerLink: "/blog/ssh-wireguard-mobile-hotspot-issue",
      title: "SSH Not Working Over Wireguard On Mobile Hotspot",
      category: "Linux",
    },
    {
      routerLink: "/blog/hello-world",
      title: "Hello World",
      category: "Programming",
    },
  ];
}
