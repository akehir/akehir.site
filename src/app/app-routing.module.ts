import { inject, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackgroundService } from '@core/services/background.service';

function disableBackground() {
  inject(BackgroundService).active = false;
}

function enableBackground() {
  inject(BackgroundService).active = true;
}

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: { background: disableBackground },
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'index',
    resolve: { background: disableBackground },
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then(m => m.AboutModule),
    resolve: { background: disableBackground },
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./pages/blog/blog.module').then(m => m.BlogModule),
    resolve: { background: disableBackground },
  },
  {
    path: 'curriculum',
    loadChildren: () =>
      import('./pages/curriculum/curriculum.module').then(
        m => m.CurriculumModule
      ),
    resolve: { background: disableBackground },
  },
  {
    path: 'machina',
    resolve: { background: enableBackground },
    loadComponent: () =>
      import('./pages/machina/machina.component').then(c => c.MachinaComponent),
  },
  {
    path: 'projects',
    resolve: { background: enableBackground },
    loadComponent: () =>
      import('./layout/map/map.component').then(c => c.MapComponent),
  },
  {
    path: 'projects/:id',
    resolve: { background: disableBackground },
    loadComponent: () =>
      import('./pages/project/project.component').then(c => c.ProjectComponent),
  },
  {
    path: 'demos/colour',
    loadComponent: () =>
      import('./pages/colour/colour.component').then(c => c.ColourComponent),
  },
  {
    path: 'demos/colour/:drawing',
    loadComponent: () =>
      import('./pages/colour/colour.component').then(c => c.ColourComponent),
    resolve: { background: disableBackground },
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent),
    children: [
      {
        path: '403',
        resolve: { background: enableBackground },
        loadComponent: () =>
          import('./pages/home/home.component').then(c => c.HomeComponent),
      },
      {
        path: '404',
        resolve: { background: enableBackground },
        loadComponent: () =>
          import('./pages/home/home.component').then(c => c.HomeComponent),
      },
      {
        path: '500',
        resolve: { background: enableBackground },
        loadComponent: () =>
          import('./pages/home/home.component').then(c => c.HomeComponent),
      },
    ],
  },
  {
    path: 'privacy',
    resolve: { background: disableBackground },
    loadChildren: () =>
      import('./pages/privacy/privacy.module').then(m => m.PrivacyModule),
  },
  {
    path: 'imprint',
    resolve: { background: disableBackground },
    loadChildren: () =>
      import('./pages/imprint/imprint.module').then(m => m.ImprintModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
