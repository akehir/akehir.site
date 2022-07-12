import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { MapComponent } from './map/map.component';
import { ProjectComponent } from './project/project.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'index', component: HomeComponent, },
  { path: 'projects', component: MapComponent, },
  { path: 'projects/:id', component: ProjectComponent },
  { path: 'error', component: MapComponent,
    children: [
      { path: '403', component: MapComponent, },
      { path: '404', component: MapComponent, },
      { path: '500', component: MapComponent, },
    ], },
  { path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'imprint', loadChildren: () => import('./imprint/imprint.module').then(m => m.ImprintModule) },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'error/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
