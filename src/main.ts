import { enableProdMode, provideZonelessChangeDetection, ViewEncapsulation } from '@angular/core';
import {
  platformBrowser,
} from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowser()
  .bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.None,
    applicationProviders: [provideZonelessChangeDetection()]
  })
  .catch(err => console.error(err));
