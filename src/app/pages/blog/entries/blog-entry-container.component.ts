import {
  ChangeDetectionStrategy,
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
  template: ` <ake-blog-entry [src]="src()"></ake-blog-entry>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogEntryComponent],
})
export class BlogEntryContainerComponent {
  #route = inject(ActivatedRoute);
  #data = toSignal<BlogData>(this.#route.data);
  src = computed(() => this.#data().content);
}
