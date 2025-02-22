import { inject, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { MapComponent } from './layout/map/map.component';
import { ProjectComponent } from './pages/project/project.component';
import { MachinaComponent } from './pages/machina/machina.component';
import { HomeComponent } from './pages/home/home.component';
import { BackgroundService } from '@core/services/background.service';
import { ColourComponent } from './pages/colour';

function disableBackground() {
  inject(BackgroundService).active = false;
}

function enableBackground() {
  inject(BackgroundService).active = true;
}

const routes: Routes = [
  {
    path: 'index',
    component: HomeComponent,
    resolve: { background: enableBackground },
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

  { path: 'machina', component: MachinaComponent },
  { path: 'projects', component: MapComponent },
  { path: 'projects/:id', component: ProjectComponent },
  {
    path: 'demos/colour',
    component: ColourComponent,
  },
  {
    path: 'demos/colour/:drawing',
    component: ColourComponent,
    resolve: { background: disableBackground },
  },
  {
    path: 'error',
    component: MapComponent,
    children: [
      { path: '403', component: MapComponent },
      { path: '404', component: MapComponent },
      { path: '500', component: MapComponent },
    ],
  },
  {
    path: 'privacy',
    loadChildren: () =>
      import('./pages/privacy/privacy.module').then(m => m.PrivacyModule),
  },
  {
    path: 'imprint',
    loadChildren: () =>
      import('./pages/imprint/imprint.module').then(m => m.ImprintModule),
  },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
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
