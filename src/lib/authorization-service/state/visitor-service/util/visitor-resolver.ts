import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Logger, MessageBus} from '@tangential/core';
import {Visitor} from '../media-type/cdm/visitor';
import {VisitorService} from '../visitor-service';

@Injectable()
export class VisitorResolver implements Resolve<Visitor> {

  constructor(private snapVisitorService: VisitorService, private bus: MessageBus) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Visitor> {
    Logger.trace(this.bus, this, 'resolve', 'enter')
    /* Wait up to five seconds for the Firebase Auth to comeback with a response. */
    return this.snapVisitorService.awaitVisitor$(5000).first().toPromise().then(x => {
      Logger.trace(this.bus, this, 'resolved', x)
      return x
    })

  }

}
