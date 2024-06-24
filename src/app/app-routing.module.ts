import {inject, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { MapComponent } from './layout/map/map.component';
import { ProjectComponent } from './pages/project/project.component';
import { HomeComponent } from './pages/home/home.component';
import {BackgroundService} from "@core/services/background.service";
import {ColourComponent} from "./pages/colour";

function disableBackground() {
  inject(BackgroundService).active = false;
}

function enableBackground() {
  inject(BackgroundService).active = true;
}


const routes: Routes = [
  { path: 'index', component: HomeComponent,resolve: { background: enableBackground }  },
  { path: 'projects', component: MapComponent, },
  { path: 'projects/:id', component: ProjectComponent },
  {
    path: 'demos/colour', component: ColourComponent,
  },
  { path: 'demos/colour/:drawing', component: ColourComponent, resolve: { background: disableBackground } },
  { path: 'error', component: MapComponent,
    children: [
      { path: '403', component: MapComponent, },
      { path: '404', component: MapComponent, },
      { path: '500', component: MapComponent, },
    ], },
  { path: 'privacy', loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'imprint', loadChildren: () => import('./pages/imprint/imprint.module').then(m => m.ImprintModule) },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'error/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
