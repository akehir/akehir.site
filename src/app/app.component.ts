import { Component, inject, ViewEncapsulation } from '@angular/core';
import { BackgroundService } from '@core/services/background.service';

@Component({
  selector: 'ake-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  standalone: false, // eslint-disable-line @angular-eslint/prefer-standalone
})
export class AppComponent {
  title = 'akehir.com | CyberShaman by the Graces of Electron';
  background = inject(BackgroundService);
}
