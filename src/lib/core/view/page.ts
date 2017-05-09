import {MessageBus, RouteInfo} from '@tangential/core';
import {OnInit} from '@angular/core';


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
