import {
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Project } from '@core/types';
import { BackgroundComponent } from '../background/background.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ake-hex',
  templateUrl: './hex.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BackgroundComponent, RouterLink],
})
export class HexComponent {
  // https://www.redblobgames.com/grids/hexagons/
  @Input() project: Project;
}
