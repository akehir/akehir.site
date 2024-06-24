import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {RpgAwesomeIconsRegistry} from "@triangular/rpg-awesome-icons";
import {rpgAwesomeIconScrollUnfurled} from "@triangular/rpg-awesome-icons/icons";
import {FontAwesomeIconsRegistry} from "@triangular/font-awesome-icons";
import {fontAwesomeIconTerminal} from "@triangular/font-awesome-icons/icons";

@Component({
  selector: 'ake-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  expanded = false;
  console = false;

  toggleNav() {
    this.expanded = !this.expanded;
  }

  toggleConsole() {
    this.console = !this.console;
  }

  hideNav() {
    this.expanded = false;
  }

  constructor(private readonly registry: RpgAwesomeIconsRegistry, private readonly fontAwesomeRegistry: FontAwesomeIconsRegistry) {
    this.registry.registerIcons([rpgAwesomeIconScrollUnfurled]);
    this.fontAwesomeRegistry.registerIcons([fontAwesomeIconTerminal])
  }
}
