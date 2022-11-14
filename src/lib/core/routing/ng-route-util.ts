import {
  ActivatedRoute,
  Route,
  Router
} from '@angular/router'

export class NgRouteUtil {

  static fullPath(route: ActivatedRoute):string {
    let pathAry:string[] = []
    route.pathFromRoot
      .map(routeSegment => routeSegment.snapshot)
      .map(routeSnap => {
        return routeSnap
      })
      .map(routeSnap => routeSnap.url)
      .filter(segments => segments && segments.length > 0)
      .forEach(segments => segments.forEach(segment => pathAry.push(segment.toString())))

    let path = pathAry.join('/')

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

  static findDescendantByComponentKey(router: Router, componentTypeKey: string): (ActivatedRoute | null ) {
    let c:ActivatedRoute | null  = router.routerState.root
    do {
      if (c.component && (c.component as any)['Key'] == componentTypeKey) {
        break
      }
      c = c.firstChild
    } while (c)
    return c
  }


  /**
   * Breadth first search of route to find the descendant where 'parent.children[x].component['Key'] === componentTypeKey'
   * This requires that the Component have the static field 'Key' declared and set to a value.
   * @param route
   * @param componentTypeKey
   * @returns {Route | null}
   */
  static findDescendantRouteByComponentKey(route: Route, componentTypeKey: string): (Route | null ) {
    let result = null
    if (route.children) {
      for (let i = 0; i < route.children.length; i++) {
        let child = route.children[i]
        if (child.component && (child.component as any)['Key'] === componentTypeKey) {
          result = child
          break
        }
      }
      if (!result) {
        for (let i = 0; i < route.children.length; i++) {
          result = NgRouteUtil.findDescendantRouteByComponentKey(route.children[i], componentTypeKey)
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
