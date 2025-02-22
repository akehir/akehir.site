import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

@Component({
  selector: 'ake-blog',
  templateUrl: './blog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [provideMarkdown()],
})
export class BlogComponent {}
