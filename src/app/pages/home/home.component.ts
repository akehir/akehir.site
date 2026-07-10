import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ake-home',
  templateUrl: './home.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
})
export class HomeComponent {}
