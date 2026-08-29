import { Component, ViewEncapsulation } from '@angular/core';
import { BlogEntryContainerComponent } from '../blog-entry-container.component';
import rawMarkdown from '../../../../../assets/blog/2026/global-cyber-skills-benchmark-ctf-2026.md?raw';

@Component({
  selector: 'ake-blog-global-cyber-skills-benchmark-ctf-2026',
  template: ` <ake-blog-entry-container
    [markdown]="markdown"></ake-blog-entry-container>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [BlogEntryContainerComponent],
})
export class GlobalCyberSkillsBenchmarkCtf2026Component {
  markdown = rawMarkdown;
}
