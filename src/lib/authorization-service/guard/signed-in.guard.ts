import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {VisitorService} from '../../visitor-service/visitor-service'


/**
 * Register this class as a Provider in your module before using it on a route.
 */
@Injectable()
export class SignedInGuard implements CanActivate {

  constructor(private router: Router, private visitorService: VisitorService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isSignedIn(state.url)
  }

  private isSignedIn(url: string): Observable<boolean> {

    return this.visitorService.awaitVisitor$().first().map(v => {
      const signedIn = v != null
      if (!signedIn) {
        this.router.navigate(['/sign-in'])
      }
      return signedIn
    })
  }
}
