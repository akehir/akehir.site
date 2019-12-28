import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import { Coordinate } from '../core/types/coordinate';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HexComponent implements OnInit {
  // https://www.redblobgames.com/grids/hexagons/
  @Input() coordinate: Coordinate;

  constructor() {
  }

  ngOnInit() {
  }
}


