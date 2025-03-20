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
        path: 'git-reset',
        loadComponent: () =>
          import('./entries/git-reset.component').then(
            c => c.GitResetComponent
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
