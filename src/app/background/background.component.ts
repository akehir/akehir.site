import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Icons} from '@core/types';

// import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ake-background',
  templateUrl: './background.component.html',
  styleUrls: [],
  // styleUrls: ['./background.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BackgroundComponent implements OnInit {
  @Input() icon: Icons;

  constructor() { }

  ngOnInit() {
  }

}
