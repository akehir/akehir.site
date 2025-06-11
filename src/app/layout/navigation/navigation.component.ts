import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  RpgAwesomeIconComponent,
  RpgAwesomeIconsRegistry,
} from '@triangular/rpg-awesome-icons';
import { rpgAwesomeIconScrollUnfurled } from '@triangular/rpg-awesome-icons/icons';
import {
  FontAwesomeIconComponent,
  FontAwesomeIconsRegistry,
} from '@triangular/font-awesome-icons';
import { fontAwesomeIconTerminal } from '@triangular/font-awesome-icons/icons';
import { NgClass } from '@angular/common';
import { ConsoleComponent } from '../console';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ake-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    ConsoleComponent,
    RpgAwesomeIconComponent,
    RouterLink,
    FontAwesomeIconComponent,
  ],
})
export class NavigationComponent {
  private readonly registry = inject(RpgAwesomeIconsRegistry);
  private readonly fontAwesomeRegistry = inject(FontAwesomeIconsRegistry);

  expanded = false;
  console = false;

  env = environment;

  toggleNav() {
    this.expanded = !this.expanded;
  }

  toggleConsole() {
    this.console = !this.console;
  }

  hideNav() {
    this.expanded = false;
  }

  constructor() {
    this.registry.registerIcons([rpgAwesomeIconScrollUnfurled]);
    this.fontAwesomeRegistry.registerIcons([fontAwesomeIconTerminal]);
  }
}
