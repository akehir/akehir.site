import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { interval } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'ake-machina',
  templateUrl: './machina.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MachinaComponent {

  kubernetes$ = interval(1000).pipe(exhaustMap(() => this.http.get('/api/widgets/kubernetes?lang=en')));

  constructor(private readonly http: HttpClient) {}
}
