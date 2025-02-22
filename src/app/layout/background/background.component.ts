import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import { IconType } from '@core/types';
import {NotoEmojiIconComponent, NotoEmojiIconsRegistry} from '@triangular/noto-emoji-icons';
import {RpgAwesomeIconComponent, RpgAwesomeIconsRegistry} from '@triangular/rpg-awesome-icons';
import {FontAwesomeIconComponent, FontAwesomeIconsRegistry} from '@triangular/font-awesome-icons';
import { notoEmojiU0023, notoEmojiU1F43A } from '@triangular/noto-emoji-icons/icons';
import {
  rpgAwesomeIconArson,
  rpgAwesomeIconDroplet,
  rpgAwesomeIconEmerald,
  rpgAwesomeIconFrostEmblem,
  rpgAwesomeIconGrass,
  rpgAwesomeIconHoleLadder,
  rpgAwesomeIconLeaf,
  rpgAwesomeIconMontains
} from '@triangular/rpg-awesome-icons/icons';
import { fontAwesomeIconHandHoldingHeart, fontAwesomeIconMountain } from '@triangular/font-awesome-icons/icons';

// import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ake-background',
  templateUrl: './background.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NotoEmojiIconComponent,
    RpgAwesomeIconComponent,
    FontAwesomeIconComponent
  ]
})
export class BackgroundComponent {
  @Input() icon: string;
  @Input() iconType: IconType;

  constructor(
    private notoEmojiIconsRegistry: NotoEmojiIconsRegistry,
    private rpgAwesomeIconsRegistry: RpgAwesomeIconsRegistry,
    private fontAwesomeIconsRegistry: FontAwesomeIconsRegistry,
    ) {
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
      rpgAwesomeIconArson
    ]);

    fontAwesomeIconsRegistry.registerIcons([
      fontAwesomeIconHandHoldingHeart,
      fontAwesomeIconMountain,
    ]);
  }
}
