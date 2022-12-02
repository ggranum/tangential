import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import {Visitor} from '@tangential/authorization-service'
import {
  DefaultPageAnalytics,
  MessageBus,
  NgUtil,
  Page,
  RouteInfo
} from '@tangential/core'
import {
  ActivatedRoute,
  Router
} from '@angular/router'
import {PluginManager} from '@tangential/plugin'
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page'

@Component({
  selector       : 'tanj-plugins-page',
  templateUrl    : './plugins.page.html',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class PluginsPage extends Page implements OnInit {

  override routeInfo: RouteInfo = {
    page     : {
      title: 'Admin Console'
    },
    analytics: DefaultPageAnalytics(),
    showAds  : false
  }
  visitor: Visitor = null

  constructor(bus: MessageBus,
              private router: Router,
              private route: ActivatedRoute,
              private parent: AdminConsoleParentPage,
              public pluginManager:PluginManager,
              private changeDetectorRef: ChangeDetectorRef) {
    super(bus)

  }

  ngOnInit() {
    this.pluginManager.scan()
  }


}



