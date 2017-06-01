import {
  ActivatedRoute,
  Route,
  Router
} from '@angular/router'

export class NgRouteUtil {

  static fullPath(route: ActivatedRoute) {
    let path = route.pathFromRoot
                    .map(routeSegment => routeSegment.snapshot)
                    .map(routeSnap => routeSnap.url).map(segment => segment.toString()).join('/')

    if (path && path.endsWith('/')) {
      path = path.substring(0, path.length - 1)
    }
    return path
  }

  static primaryLeaf(router: Router): ActivatedRoute {
    let c = router.routerState.root
    while (c.firstChild) {
      c = c.firstChild
    }
    return c
  }

  static findDescendantByComponentName(router: Router, componentTypeName: string): (ActivatedRoute | null ) {
    let c = router.routerState.root
    do {
      if (c.component && c.component['name'] == componentTypeName) {
        break
      }
      c = c.firstChild
    } while (c)
    return c
  }


  /**
   * Breadth first search of route to find the descendant where 'parent.children[x].component['name'] === componentTypeName'
   * @param route
   * @param componentTypeName
   * @returns {Route | null}
   */
  static findDescendantRouteByComponentName(route: Route, componentTypeName: string): (Route | null ) {
    let result = null
    if (route.children) {
      for (let i = 0; i < route.children.length; i++) {
        let child = route.children[i]
        if (child.component && child.component['name'] === componentTypeName) {
          result = child
          break
        }
      }
      if (!result) {
        for (let i = 0; i < route.children.length; i++) {
          result = NgRouteUtil.findDescendantRouteByComponentName(route.children[i], componentTypeName)
          if (result) {
            break
          }
        }
      }
    }
    return result
  }

  /**
   * Breadth first search of route to find the descendant where 'parent.children[x].path === path'
   * @param route
   * @param path
   * @returns {Route | null}
   */
  static findDescendantRouteByPath(route: Route, path: string): (Route | null ) {
    let result = null
    if (route.children) {
      for (let i = 0; i < route.children.length; i++) {
        let child = route.children[i]
        if (child.path === path) {
          result = child
          break
        }
      }
      if (!result) {
        for (let i = 0; i < route.children.length; i++) {
          result = NgRouteUtil.findDescendantRouteByPath(route.children[i], path)
          if (result) {
            break
          }
        }
      }
    }
    return result
  }

}
