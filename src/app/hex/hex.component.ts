import {Component, Input, ViewEncapsulation} from '@angular/core';
import { Coordinate } from '../core/types/coordinate';
import { FluidSimulationService } from '@triangular/fluid-simulation';

@Component({
  selector: 'ake-hex',
  templateUrl: './hex.component.html',
  styleUrls: [],
  // styleUrls: ['./hex.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HexComponent {
  // https://www.redblobgames.com/grids/hexagons/
  @Input() coordinate: Coordinate;

  constructor(private fluidSimulation: FluidSimulationService) { }

  onClick() {
    this.fluidSimulation.PAUSED = !this.fluidSimulation.PAUSED;
  }
}

