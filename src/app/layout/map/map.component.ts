import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

import { Coordinate } from '@core/types/coordinate';
import { ProjectsService } from '@core/services/projects.service';
import {HexComponent} from "../hex/hex.component";
import {AsyncPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'ake-map',
  templateUrl: './map.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HexComponent,
    AsyncPipe,
    NgForOf
  ]
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
