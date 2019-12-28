import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FirstMap } from '../core/data/FirstMap';
import { Coordinate } from '../core/types/coordinate';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit {
  // https://www.redblobgames.com/grids/hexagons/
  public map = new FirstMap();

  constructor() { }

  ngOnInit() {
    console.log(this.map);
  }

  trackCoordinate(index, item: Coordinate) {
    return `${item.x}-${item.y}`;
  }

  log = console.log;
}
