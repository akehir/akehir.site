import { Map } from '../types/map';
import {ForestEnvironment, IceEnvironment, LandEnvironment, MountainEnvironment, WaterEnvironment} from '../types/environment';

// todo: units to project
import { projectList } from './ProjectList';

export class FirstMap implements Map {
  coordinates = [
    // Line 1
    { y: 0, x: 0, project: projectList[0], },
    { y: 1, x: 0, project: projectList[1], },
    { y: 2, x: 0, project: projectList[2], },
    { y: 3, x: 0, project: projectList[3], },
    { y: 4, x: 0, project: projectList[4], },
    // // Line 2
    // { y: 0, x: 1, project: projectList[0], },
    // { y: 1, x: 1, project: projectList[1], },
    // { y: 2, x: 1, project: projectList[2], },
    // { y: 3, x: 1, project: projectList[3], },
    // // Line 3
    // { y: 0, x: 2, project: projectList[0], },
    // { y: 1, x: 2, project: projectList[1], },
    // { y: 2, x: 2, project: projectList[2], },
    // { y: 3, x: 2, project: projectList[3], },
    // { y: 4, x: 2, project: projectList[4], },
    // // Line 4
    // { y: 0, x: 3, project: projectList[0], },
    // { y: 1, x: 3, project: projectList[1], },
    // { y: 2, x: 3, project: projectList[2], },
    // { y: 3, x: 3, project: projectList[3], },
  ];
}
