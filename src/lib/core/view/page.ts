import {OnInit} from '@angular/core';
// noinspection TypeScriptPreferShortImport
import {MessageBus} from '../message-bus/message-bus';
// noinspection TypeScriptPreferShortImport
import {RouteInfo} from '../routing/route-info';


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
