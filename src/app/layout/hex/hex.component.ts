import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import { Project } from '@core/types';
import {BackgroundComponent} from "../background/background.component";

@Component({
  selector: 'ake-hex',
  templateUrl: './hex.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BackgroundComponent
  ]
})
export class HexComponent {
  // https://www.redblobgames.com/grids/hexagons/
  @Input() project: Project;

}

