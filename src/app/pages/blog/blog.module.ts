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
        path: 'stable-diffusion-docker-rocm',
        loadComponent: () =>
          import('./entries/stable-diffusion-docker-rocm.component').then(
            c => c.StableDiffusionDockerRocmComponent
          ),
      },
       {
        path: 'llama-cpp-docker-rocm',
        loadComponent: () =>
          import('./entries/llama-cpp-docker-rocm.component').then(
            c => c.LlamaCppDockerRocmComponent
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
