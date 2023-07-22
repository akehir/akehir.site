import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

import { Coordinate } from '../core/types/coordinate';
import { ProjectsService } from '@core/services/projects.service';

@Component({
  selector: 'ake-map',
  templateUrl: './map.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {

  constructor(private projects: ProjectsService) { }
  // https://www.redblobgames.com/grids/hexagons/
  map$ = this.projects.all(); // mocking async

  log = console.log;
  trackCoordinate(index, item: Coordinate) {
    return `${item.x}-${item.y}`;
  }
}
