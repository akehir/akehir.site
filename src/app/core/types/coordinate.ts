import { Project } from './project';

export type Coordinate = BaseCoordinate;
// https://www.redblobgames.com/grids/hexagons/



export interface BaseCoordinate {
  x: number;
  y: number;
  project: Project;
}
