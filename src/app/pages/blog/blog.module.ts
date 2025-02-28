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
        path: 'hello-world',
        loadComponent: () =>
          import('./entries/stable-diffusion-docker-rocm.component').then(
            c => c.StableDiffusionDockerRocmComponent
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
