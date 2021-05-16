import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import { Coordinate } from '../core/types/coordinate';
import { ProjectsService } from '@core/services/projects.service';

@Component({
  selector: 'ake-map',
  templateUrl: './map.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit {

  constructor(private projects: ProjectsService) { }
  // https://www.redblobgames.com/grids/hexagons/
  map$ = this.projects.all(); // mocking async

  log = console.log;

  ngOnInit() {
  }

  trackCoordinate(index, item: Coordinate) {
    return `${item.x}-${item.y}`;
  }
}
