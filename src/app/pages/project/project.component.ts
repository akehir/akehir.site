import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Project } from '@core/types/project';
import { ProjectsService } from '@core/services/projects.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HexComponent } from '../../layout/hex/hex.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'ake-project',
  templateUrl: './project.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HexComponent, JsonPipe, AsyncPipe, NgIf],
})
export class ProjectComponent {
  project$: Observable<Project>;

  constructor(
    private projects: ProjectsService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ) {
    this.project$ = this.route.params.pipe(
      mergeMap(params => this.projects.get(params['id']))
    );
  }

  getIframeSrc(str: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(str);
  }
}
