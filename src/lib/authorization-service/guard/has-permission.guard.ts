import {Injectable} from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import {
  MessageBus,
  NavigationRequiresAuthenticationMessage,
  NavigationRequiresPermissionMessage,
  NgUtil
} from '@tangential/core'
import {Observable} from 'rxjs/Observable'
import {AuthSubject} from '../media-type/cdm/auth-subject'
//noinspection TypeScriptPreferShortImport
import {AuthenticationService} from '../state/authentication-service/authentication-service'


/**
 * Register this class as a Provider in your module before using it on a route.
 */
@Injectable()
export class HasPermissionGuard implements CanActivate, CanLoad, CanActivateChild {

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

  private requiredPermissions(activeRoute: ActivatedRouteSnapshot, route?: Route): string[] {
    let data: any
    if (activeRoute) {
      data = NgUtil.data(activeRoute)
    } else {
      data = route.data
    }
    return data.permissions || []
  }

  private doCheck(activeRoute: ActivatedRouteSnapshot, route?: Route): Observable<boolean> {
    const path = activeRoute ? activeRoute.toString() : route.path
    const permissions = this.requiredPermissions(activeRoute, route)
    return this.authService.awaitKnownAuthSubject$().first().map(v => {
      let canDo: boolean
      if (!v.isSignedIn()) {
        canDo = false
        NavigationRequiresAuthenticationMessage.post(this.bus, path)
        this.router.navigate(['/sign-in'])
      } else {
        canDo = v.hasPermissions(permissions)
        if (!canDo) {
          NavigationRequiresPermissionMessage.post(this.bus, path, this.firstMissingPermission(v, permissions))
          this.router.navigate(['/home'])
        }
      }
      return canDo
    })
  }

  private firstMissingPermission(subject: AuthSubject, permissions: string[]): string {
    let permission: string
    for (let i = 0; i < permissions.length; i++) {
      if (!subject.hasPermission(permissions[i])) {
        permission = permissions[i]
        break
      }
    }
    return permission
  }

}
