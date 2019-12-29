import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FirstMap } from '../core/data/FirstMap';
import { Coordinate } from '../core/types/coordinate';
import { FluidSimulationService } from '../fluid-simulation/services';
import {Project} from '@core/types';

@Component({
  selector: 'ake-map',
  templateUrl: './map.component.html',
  styleUrls: [],
  // styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit {

  constructor() { }
  // https://www.redblobgames.com/grids/hexagons/
  public map = new FirstMap();

  log = console.log;

  ngOnInit() {
  }

  trackCoordinate(index, item: Coordinate) {
    return `${item.x}-${item.y}`;
  }
}
