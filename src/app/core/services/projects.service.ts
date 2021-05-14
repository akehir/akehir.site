import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FirstMap } from '@core/data/FirstMap';
import { Map, Project } from '@core/types';
import { map } from 'rxjs/operators';


@Injectable()
export class ProjectsService {

  all(): Observable<Map> {
    return of(new FirstMap());
  }

  get(id: string): Observable<Project> {
    return this.all().pipe(
      map(_map => _map.coordinates
          .map((coordinate) => coordinate.project)
          .find((project) => project.id === id)
      )
    );
  }
}
