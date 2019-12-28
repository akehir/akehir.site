import { Map } from '../types';

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
    { y: 5, x: 0, project: projectList[0], },
    { y: 6, x: 0, project: projectList[1], },
    { y: 7, x: 0, project: projectList[2], },
    { y: 8, x: 0, project: projectList[3], },
    { y: 9, x: 0, project: projectList[4], },
    // // Line 2
    { y: 0, x: 1, project: projectList[0], },
    { y: 1, x: 1, project: projectList[1], },
    { y: 2, x: 1, project: projectList[2], },
    { y: 3, x: 1, project: projectList[3], },
    { y: 4, x: 1, project: projectList[0], },
    { y: 5, x: 1, project: projectList[1], },
    { y: 6, x: 1, project: projectList[2], },
    { y: 7, x: 1, project: projectList[3], },
    { y: 8, x: 1, project: projectList[0], },
    // // Line 3
    { y: 0, x: 2, project: projectList[0], },
    { y: 1, x: 2, project: projectList[1], },
    { y: 2, x: 2, project: projectList[2], },
    { y: 3, x: 2, project: projectList[3], },
    { y: 4, x: 2, project: projectList[4], },
    { y: 5, x: 2, project: projectList[0], },
    { y: 6, x: 2, project: projectList[1], },
    { y: 7, x: 2, project: projectList[2], },
    { y: 8, x: 2, project: projectList[3], },
    { y: 9, x: 2, project: projectList[4], },
    // // Line 4
    { y: 0, x: 3, project: projectList[0], },
    { y: 1, x: 3, project: projectList[1], },
    { y: 2, x: 3, project: projectList[2], },
    { y: 3, x: 3, project: projectList[3], },
    { y: 4, x: 3, project: projectList[0], },
    { y: 5, x: 3, project: projectList[1], },
    { y: 6, x: 3, project: projectList[2], },
    { y: 7, x: 3, project: projectList[3], },
    { y: 8, x: 3, project: projectList[3], },
  ];
}
