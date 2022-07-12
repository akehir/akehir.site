import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import { Project } from '@core/types';

@Component({
  selector: 'ake-hex',
  templateUrl: './hex.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexComponent {
  // https://www.redblobgames.com/grids/hexagons/
  @Input() project: Project;

  constructor() { }

}

