import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { interval } from 'rxjs';
import { exhaustMap, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

type ClusterInfo = {
  "cluster": {
    "cpu": {
      "load": number,
        "total": number,
        "percent": number
    },
    "memory": {
      "used": number,
        "total": number,
        "free": number,
        "percent": number
    }
  },
  "nodes": [
    {
      "name": string,
      "ready": boolean,
      "cpu": {
        "total": number,
        "load": number,
        "percent": number
      },
      "memory": {
        "total": number,
        "used": number,
        "free": number,
        "percent": number
      }
    }
  ]
}

@Component({
  selector: 'ake-machina',
  templateUrl: './machina.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MachinaComponent {

  kubernetes$ = interval(4000).pipe(startWith(-1), exhaustMap(() => this.http.get<ClusterInfo>('/api/widgets/kubernetes?lang=en')));

  constructor(private readonly http: HttpClient) {}

  getStyle(percent: number) {
    return `width: ${percent}%;`
  }
}
