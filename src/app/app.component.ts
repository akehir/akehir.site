import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {BackgroundService} from "@core/services/background.service";

@Component({
  selector: 'ake-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'akehir.com | CyberShaman by the Graces of Electron';
  background = inject(BackgroundService);
}
