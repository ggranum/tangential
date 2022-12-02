import {ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'



export class NgUtil {

  static data$(route: ActivatedRoute):Observable<{}> {
    return route.data.pipe(map((data: any) => {
      return NgUtil.collectFromRoute(route.snapshot, true)
    }))
  }

  static data(route: ActivatedRouteSnapshot): any {
    return NgUtil.collectFromRoute(route, true)
  }

  static params(route: ActivatedRouteSnapshot): any {
    return NgUtil.collectFromRoute(route, false)
  }

  static collectFromRoute(route: ActivatedRouteSnapshot, data: boolean): any {
    const datas: any[] = [{}]
    let child:ActivatedRouteSnapshot|null = route.root
    while (child) {
      const what = data ? child.data : child.params
      datas.push(what || {})
      child = child.firstChild
    }
    // merge them all together...
    return Object.assign.apply(Object, datas as any) as any
  }

  static params$(route: ActivatedRoute) {
    return route.params.pipe(map((params: any) => {
      return NgUtil.collectFromRoute(route.snapshot, false)
    }))
  }

  static routeLeaf(route: RouterStateSnapshot): ActivatedRouteSnapshot {
    let child = route.root

    while (child.firstChild) {
      child = child.firstChild
    }
    return child
  }

  static keylessUrl(route: RouterStateSnapshot): string {
    return route.url ? route.url.split('/').map(
      segment => NgUtil.isFirebaseId(segment) ? ':key' : segment).join('/') : ''
  }

  /**
   *
   * @param key
   * @returns {boolean}
   * @deprecated See FireBlanket.util#isFirebaseGeneratedId
   */
  static isFirebaseId(key: string): boolean {
    let isKey = false
    if (key && key.length === 20 && key.startsWith('-')) {
      isKey = true
    }
    return isKey
  }

}
