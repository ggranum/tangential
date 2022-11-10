import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router'
import {Observable} from 'rxjs'
import {first, map} from 'rxjs/operators'
//noinspection TypeScriptPreferShortImport
import {VisitorService} from '../state/visitor-service/visitor-service';


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

    return this.visitorService.awaitVisitor$().pipe(
      first(),
      map(v => {
        const signedIn = v != null
        if (!signedIn) {
          this.router.navigate(['/sign-in'])
        }
        return signedIn
      }))
  }
}
