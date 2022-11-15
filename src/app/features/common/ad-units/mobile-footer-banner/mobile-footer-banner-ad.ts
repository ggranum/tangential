import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core'
import {AppEnvironment} from '@tangential/core';

@Component({
  selector:      'tanj-ad-mobile-footer-banner',
  template:      `
                   <ng2-adsense *ngIf="showingAdBlocks && !suppressingAds"
                                [adClient]="'ca-pub-0484786890985435'"
                                [adSlot]="'2655794844'"
                                [adFormat]="null"
                                [adRegion]="adRegion"
                                [height]="50"
                                [width]="320"
                                style="height:50px;max-height:50px"></ng2-adsense>
                   <div *ngIf="showingAdBlocks && suppressingAds" [ngStyle]="{'display': display, 'width.px': width, 'height.px': height }"
                        style="text-align: center;background-color: rgb(95,158,160)">Ads suppressed.
                   </div>
                 `,
  encapsulation: ViewEncapsulation.None
})
export class MobileFooterBannerAdComponent {
//  height:50px; max-height: 50px; width: 320px; max-width: 320px;
  @Input() adRegion: string | undefined

  display: string = 'inline-block'
  height: number = 50
  width: number = 320

  @HostBinding('style.height') sHeight: string = '50px';
  @HostBinding('style.max-height') sMaxHeight: string = '50px';
  @HostBinding('style.overflow') sOverflow: string = 'hidden';

  showingAdBlocks = true
  suppressingAds = false

  constructor(config: AppEnvironment) {
    this.suppressingAds = config.suppressAds
  }

}

