import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
// noinspection ES6PreferShortImport
import {MessageBus} from '../message-bus/message-bus';
// noinspection ES6PreferShortImport
import {RouteInfo} from '../routing/route-info';

/**
 * Apparently Angular doesn't like abstract components anymore.
 */
@Component({
  selector:        'tanj-page',
  templateUrl:     './page.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class Page implements OnInit {

  public routeInfo: RouteInfo

  constructor(protected bus:MessageBus) {
    this.routeInfo = {
      page: {
        title: this.constructor['name']
      },
      showAds: false
    }
  }

  ngOnInit(): void {
  }

}
