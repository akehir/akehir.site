import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Project} from '../core/types/project';

@Component({
  selector: 'ake-project',
  templateUrl: './project.component.html',
  styleUrls: [],
  // styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectComponent implements OnInit {
  @Input() project: Project;

  constructor() { }

  ngOnInit() {
  }

}
