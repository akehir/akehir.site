import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ake-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'akehir.com | CyberShaman by the Graces of Electron';
}
