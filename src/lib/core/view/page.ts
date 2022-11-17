// noinspection ES6PreferShortImport
import {MessageBus} from '../message-bus/message-bus';
// noinspection ES6PreferShortImport
import {RouteInfo} from '../routing/route-info';

/**
 * Cannot implement 'OnInit' any longer; Angular inspects for that and requires a decorator.
 */
export abstract class Page  {

  public routeInfo: RouteInfo

  protected constructor(protected bus:MessageBus) {
    this.routeInfo = {
      page: {
        title: this.constructor['name']
      },
      showAds: false
    }
  }

}
