import { Injectable }     from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router}    from '@angular/router';
import {VisitorService} from "../state/visitor/visitor-service";

/**
 * Don't forget to register this class as a Provider in your module before using it on a route.
 */
@Injectable()
export class SignedInGuard implements CanActivate {

  constructor(private _router: Router, private _visitorService:VisitorService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
    return this.isSignedIn(state.url)
  }

  private isSignedIn(url:string):boolean {
    let signedIn = true
    if(this._visitorService.isVisitorSignedIn()){
      signedIn = true
    } else {
      signedIn = false
      // Store the attempted URL for redirecting
      this._visitorService.redirectUrl = url
      this._router.navigate(['/sign-in'])
    }

    return signedIn
  }
}
