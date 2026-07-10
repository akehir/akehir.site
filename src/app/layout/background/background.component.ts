import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { IconType } from '@core/types';
import {
  NotoEmojiIconComponent,
  NotoEmojiIconsRegistry,
} from '@triangular/noto-emoji-icons';
import {
  RpgAwesomeIconComponent,
  RpgAwesomeIconsRegistry,
} from '@triangular/rpg-awesome-icons';
import {
  FontAwesomeIconComponent,
  FontAwesomeIconsRegistry,
} from '@triangular/font-awesome-icons';
import {
  notoEmojiU0023,
  notoEmojiU1F43A,
} from '@triangular/noto-emoji-icons/icons';
import {
  rpgAwesomeIconArson,
  rpgAwesomeIconDroplet,
  rpgAwesomeIconEmerald,
  rpgAwesomeIconFrostEmblem,
  rpgAwesomeIconGrass,
  rpgAwesomeIconHoleLadder,
  rpgAwesomeIconLeaf,
  rpgAwesomeIconMontains,
} from '@triangular/rpg-awesome-icons/icons';
import {
  fontAwesomeIconHandHoldingHeart,
  fontAwesomeIconMountain,
} from '@triangular/font-awesome-icons/icons';

// import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ake-background',
  templateUrl: './background.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  imports: [
    NotoEmojiIconComponent,
    RpgAwesomeIconComponent,
    FontAwesomeIconComponent,
  ],
})
export class BackgroundComponent {
  private notoEmojiIconsRegistry = inject(NotoEmojiIconsRegistry);
  private rpgAwesomeIconsRegistry = inject(RpgAwesomeIconsRegistry);
  private fontAwesomeIconsRegistry = inject(FontAwesomeIconsRegistry);

  @Input() icon!: string;
  @Input() iconType!: IconType;

  constructor() {
    const notoEmojiIconsRegistry = this.notoEmojiIconsRegistry;
    const rpgAwesomeIconsRegistry = this.rpgAwesomeIconsRegistry;
    const fontAwesomeIconsRegistry = this.fontAwesomeIconsRegistry;

    notoEmojiIconsRegistry.registerIcons([
      notoEmojiU0023,
      notoEmojiU1F43A,
      // add more icons here
    ]);

    rpgAwesomeIconsRegistry.registerIcons([
      rpgAwesomeIconDroplet,
      rpgAwesomeIconGrass,
      rpgAwesomeIconLeaf,
      rpgAwesomeIconMontains,
      rpgAwesomeIconFrostEmblem,
      rpgAwesomeIconEmerald,
      rpgAwesomeIconHoleLadder,
      rpgAwesomeIconArson,
    ]);

    fontAwesomeIconsRegistry.registerIcons([
      fontAwesomeIconHandHoldingHeart,
      fontAwesomeIconMountain,
    ]);
  }
}
