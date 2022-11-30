import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core'
import {Router} from '@angular/router'
import {AuthenticationService, Visitor, VisitorService} from '../../../../../projects/tangential/authorization-service/src/lib'
import {DefaultPageAnalytics, Logger, MessageBus, Page, RouteInfo} from '@tangential/core'
import {Subscription} from 'rxjs'
import {AppRouteDefinitions} from '../../../app.routes.definitions'
import {AppRoutes} from '../../../app.routing.module'

@Component({
  selector:        'tanj-home-page',
  templateUrl:     './home.page.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomePage extends Page implements AfterViewInit, OnDestroy {

  visitor: Visitor | undefined = undefined

  private subs: Subscription[] = []

  override routeInfo:RouteInfo = {
    page: {
      title: 'Tangential: Home'
    },
    analytics: DefaultPageAnalytics(),
    showAds: false
  }

  appRoutes = AppRoutes

  constructor(bus: MessageBus,
              protected logger: Logger,
              private router: Router,
              private authService: AuthenticationService,
              private visitorService: VisitorService,
              private changeDetectorRef: ChangeDetectorRef) {
    super(bus)
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe()
    })
  }

  ngAfterViewInit() {
    const sub = this.visitorService.visitor$().subscribe(visitor => {
      this.visitor = visitor
      this.logger.trace(this, 'Visitor changed', visitor)
      this.changeDetectorRef.detectChanges()
    });
    this.subs.push(sub)
  }


  onSignIn() {
    this.router.navigate(AppRouteDefinitions.home.navTargets.absSignIn())
  }

  onAnonymousLoginRequest() {
    this.authService.signInAnonymously().then(() => {
      this.router.navigate(AppRouteDefinitions.home.navTargets.absTryoutWelcome())
    })
  }
}



