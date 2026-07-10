import { Component, ViewEncapsulation, inject } from '@angular/core';

import { Coordinate } from '@core/types/coordinate';
import { ProjectsService } from '@core/services/projects.service';
import { HexComponent } from '../hex/hex.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ake-map',
  templateUrl: './map.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [HexComponent, AsyncPipe],
})
export class MapComponent {
  private projects = inject(ProjectsService);

  // https://www.redblobgames.com/grids/hexagons/
  map$ = this.projects.all(); // mocking async

  log = console.log;
  trackCoordinate(index: number, item: Coordinate) {
    return `${item.x}-${item.y}`;
  }
}
