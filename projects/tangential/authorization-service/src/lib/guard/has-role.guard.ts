import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {MessageBus, NavigationRequiresAuthenticationMessage, NavigationRequiresRoleMessage, NgUtil} from '@tangential/core';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators'
import {AuthSubject} from '../media-type/cdm/auth-subject';
//noinspection ES6PreferShortImport
import {AuthenticationService} from '../state/authentication-service/authentication-service';


/**
 * Register this class as a Provider in your module before using it on a route.
 */
@Injectable()
export class HasRoleGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(private bus: MessageBus, private router: Router, private authService: AuthenticationService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.doCheck(route, null)
  }

  public canLoad(route: Route): Observable<boolean> {
    return this.doCheck(null, route)
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.doCheck(childRoute, null)
  }

  private requiredRoles(activeRoute: ActivatedRouteSnapshot, route?: Route): string[] {
    let data: any
    if (activeRoute) {
      data = NgUtil.data(activeRoute)
    } else {
      data = route.data
    }
    return data.roles || []
  }

  private doCheck(activeRoute: ActivatedRouteSnapshot, route?: Route): Observable<boolean> {
    const path = activeRoute ? activeRoute.toString() : route.path
    const roles = this.requiredRoles(activeRoute, route)
    return this.authService.awaitKnownAuthSubject$().pipe(
      first(),
      map(v => {
        let canDo: boolean
        if (!v.isSignedIn()) {
          canDo = false
          NavigationRequiresAuthenticationMessage.post(this.bus, path)
          this.router.navigate(['/sign-in'])
        } else {
          canDo = v.hasRoles(roles)
          if (!canDo) {
            NavigationRequiresRoleMessage.post(this.bus, path, this.firstMissingRole(v, roles))
            this.router.navigate(['/home'])
          }
        }
        return canDo
      }))
  }

  private firstMissingRole(subject: AuthSubject, roles: string[]): string {
    let role: string
    for (let i = 0; i < roles.length; i++) {
      if (!subject.hasRole(roles[i])) {
        role = roles[i]
        break
      }
    }
    return role
  }

}
