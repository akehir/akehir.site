import {
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { BlogEntryComponent } from './blog-entry.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BlogData } from '../blog.module';

@Component({
  selector: 'ake-blog-entry-container',
  template: ` <ake-blog-entry
    [src]="src()"
    [title]="title()"
    [sourceLink]="sourceLink()"
    [publishedDate]="publishedDate()"></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryComponent],
})
export class BlogEntryContainerComponent {
  #route = inject(ActivatedRoute);
  #data = toSignal<BlogData>(this.#route.data);
  src = computed(() => this.#data().content);
  publishedDate = computed(() => this.#data().publishedDate);
  title = computed(() => this.#data().title);
  sourceLink = computed(() => this.#data().source);
}
