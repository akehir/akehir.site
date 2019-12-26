import {Component, Input, OnInit} from '@angular/core';
import {Environment} from '../core/types/environment';
// import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input('type') type: Environment;

  constructor() { }

  ngOnInit() {
  }

}
