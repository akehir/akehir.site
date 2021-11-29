import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Project} from '../core/types/project';
import { ProjectsService } from '@core/services/projects.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'ake-project',
  templateUrl: './project.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectComponent implements OnInit {

  project$: Observable<Project>;

  constructor(
    private projects: ProjectsService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    ) {
    this.project$ = this.route.params.pipe(
      mergeMap(params =>
        this.projects.get(params['id'])
      )
    );
  }

  ngOnInit() {
  }

  getIframeSrc(str: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(str);
  }

}
