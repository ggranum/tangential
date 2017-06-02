import {Injectable} from '@angular/core'
import {
  Route,
  Router
} from '@angular/router'
import {TangentialPlugin} from './plugin'
import {isString} from 'util'


/**
 * The plugin manager must be added as a Provider in your AppModule.
 *
 * You may register plugins manually after normal initialization, however, it is better to stick with naming conventions so that
 * plugins may be discovered from the router configuration.
 */
@Injectable()
export class PluginManager {

  pluginPaths: { path: string, name: string }[] = []
  private plugins: TangentialPlugin[] = []


  constructor(private router: Router) {
  }

  getPlugins(): TangentialPlugin[] {
    return this.plugins
  }

  scan() {
    let routes = this.findPluginRoutes()

    this.pluginPaths = routes.map(route => {
      let str = <string>route.loadChildren
      return {
        path: route.path,
        name: str.substring(str.lastIndexOf('#') + 1)
      }
    })
  }

  register(plugin: TangentialPlugin) {
    this.plugins.push(plugin)
  }

  /**
   * Does NOT search sub-modules. Only lazy-loaded modules on the App Root Route.
   */
  findPluginRoutes(): (Route[]) {
    let result: Route[] = []
    let routes = this.router.config
    if (routes) {
      for (let i = 0; i < routes.length; i++) {
        let child = routes[i]
        if (child.loadChildren && isString(child.loadChildren) && (<string>child.loadChildren).endsWith('PluginModule')) {
          result.push(child)
        }
      }
    }
    return result
  }
}
