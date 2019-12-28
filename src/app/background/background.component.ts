import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Environment} from '../core/types/environment';

// import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BackgroundComponent implements OnInit {
  @Input() type: Environment;

  constructor() { }

  ngOnInit() {
  }

}
