/* CommonModule required for ngStyle */
import {CommonModule} from '@angular/common'
/**
 *
 * Source: https://github.com/scttcper/ng2-adsense/blob/master/src/lib/ng2-adsense.ts
 *
 */
import {
  AfterViewInit,
  Component, InjectionToken,
  Input,
  ModuleWithProviders,
  NgModule,
  OnInit,
} from '@angular/core'

declare const window

export class AdsenseConfig {

  adClient?: string;
  adSlot?: string | number;
  adFormat?: string;
  display?: string;
  width?: number;
  height?: number;

  constructor(config: AdsenseConfig = {}) {
    this.adClient = config.adClient || this.adClient;
    this.adSlot = config.adSlot || this.adSlot;
    this.adFormat = config.adFormat || this.adFormat;
    this.display = config.display || 'block'
    this.width = config.width
    this.height = config.height
  }
}

@Component({
  selector: 'ng2-adsense',
  template: `
              <div class="ng2-adsense">
                <ins class="adsbygoogle"
                     style="display:inline-block;width:320px;height:50px"
                     [attr.data-ad-client]="adClient"
                     [attr.data-ad-slot]="adSlot"
                     [attr.data-ad-format]="adFormat"
                     [attr.data-ad-region]="adRegion"></ins>
              </div>
            `,
  styles:   [
      `.ng2-adsense {
      padding-bottom : 8px;
    } `]
})
export class AdsenseComponent implements OnInit, AfterViewInit {
  @Input() adClient: string;
  @Input() adSlot: string | number;
  @Input() adFormat = 'auto';
  @Input() adRegion = 'page-' + Math.floor(Math.random() * 10000) + 1;
  @Input() display: string;
  @Input() width: number;
  @Input() height: number;


  private pushed: boolean = false

  constructor(private config: AdsenseConfig) {
  }

  ngOnInit() {
    this.adClient = this.adClient || this.config.adClient;
    this.adSlot = this.adSlot || this.config.adSlot;
    this.adFormat = this.adFormat || this.config.adFormat;
    this.display = this.display || this.config.display;
    this.width = this.width || this.config.width;
    this.height = this.height || this.config.height;
  }

  ngAfterViewInit() {
    // attempts to push the ad twice. Usually if one doesn't work the other
    // will depending on if the browser has the adsense code cached
    this.push();
    if (!this.pushed) {
      setTimeout(() => this.push(), 200);
    }
  }

  push() {
    try {
      const adsByGoogle = window['adsbygoogle'];
      adsByGoogle .push({});
      this.pushed = true
    } catch (e) {
      console.warn('Could not load ads')
    }
  }
}

export const ADSENSE_CONFIG = new InjectionToken('AdsenseConfig');

export function provideAdsenseConfig(config: AdsenseConfig) {
  return new AdsenseConfig(config);
}

@NgModule({
  imports:      [CommonModule],
  exports:      [AdsenseComponent],
  declarations: [AdsenseComponent],
})
export class AdsenseModule {
  static forRoot(config?: AdsenseConfig): ModuleWithProviders {
    return {
      ngModule:  AdsenseModule,
      providers: [
        {
          provide:  ADSENSE_CONFIG,
          useValue: config
        }, {
          provide:    AdsenseConfig,
          useFactory: provideAdsenseConfig,
          deps:       [ADSENSE_CONFIG]
        }]
    };
  }
}
