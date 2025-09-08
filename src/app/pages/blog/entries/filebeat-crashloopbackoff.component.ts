import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './entry.component';

@Component({
  selector: 'ake-blog-filebeat-crashloopbackoff',
  template: ` <ake-blog-entry
    [src]="'/assets/blog/filebeat-crashloopbackoff.md'"></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class FileBeatCrashLoopBackOffComponent {}
