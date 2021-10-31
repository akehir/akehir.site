import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Map, Project } from '@core/types';
import { projectList } from '@core/data';


@Injectable()
export class ProjectsService {

  all(): Observable<Map> {
    return of({coordinates: Object.values(projectList).map(project => ({ x: 0, y: 0, project}))});
  }

  get(id: string): Observable<Project> {
    return of(projectList[id]);
  }
}
