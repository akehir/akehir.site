import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { Project } from '@core/types/project';
import { ProjectsService } from '@core/services/projects.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HexComponent } from '../../layout/hex/hex.component';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'ake-project',
  templateUrl: './project.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HexComponent, JsonPipe, AsyncPipe],
})
export class ProjectComponent {
  private projects = inject(ProjectsService);
  private route = inject(ActivatedRoute);
  private domSanitizer = inject(DomSanitizer);

  project$: Observable<Project>;

  constructor() {
    this.project$ = this.route.params.pipe(
      mergeMap(params => this.projects.get(params['id']))
    );
  }

  getIframeSrc(str: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(str);
  }
}
