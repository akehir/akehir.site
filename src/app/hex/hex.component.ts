import { Component, OnInit, Input } from '@angular/core';
import { Coordinate } from '../core/types/coordinate';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.scss']
})
export class HexComponent implements OnInit {
  // https://www.redblobgames.com/grids/hexagons/
  @Input('coordinate') coordinate: Coordinate;

  constructor() {
  }

  ngOnInit() {
  }
}


