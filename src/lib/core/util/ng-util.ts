import {ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'
export class NgUtil {


  static data$(route: ActivatedRoute) {
    return route.data.map((data: any) => {
      return NgUtil.collectFromRoute(route.snapshot, true)
    })
  }

  static data(route: ActivatedRouteSnapshot): any {
    return NgUtil.collectFromRoute(route, true)
  }

  static params(route: ActivatedRouteSnapshot): any {
    return NgUtil.collectFromRoute(route, false)
  }

  static collectFromRoute(route: ActivatedRouteSnapshot, data: boolean): any {
    const datas: any[] = [{}]
    let child = route.root
    while (child) {
      const what = data ? child.data : child.params
      datas.push(what || {})
      child = child.firstChild
    }
    // merge them all together...
    return Object.assign.apply(Object, datas)
  }

  static params$(route: ActivatedRoute) {
    return route.params.map((params: any) => {
      return NgUtil.collectFromRoute(route.snapshot, false)
    })
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

  static isFirebaseId(key: string): boolean {
    let isKey = false
    if (key && key.length === 20 && key.startsWith('-')) {
      isKey = true
    }
    return isKey
  }

}
