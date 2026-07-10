import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';

@Component({
  selector: 'ake-blog-the-photography-parable-and-programming',
  template: ` <ake-blog-entry-container></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class ThePhotographyParableAndProgrammingComponent {}
