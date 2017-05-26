import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core'
import {Router} from '@angular/router'
import {AuthenticationService, Visitor, VisitorService} from '@tangential/authorization-service'
import {DefaultPageAnalytics, Logger, MessageBus, Page, RouteInfo} from '@tangential/core'
import {Subscription} from 'rxjs/Subscription'
import {AppRoutes} from '../../../app.routing.module'

@Component({
  selector:        'tanj-home-page',
  templateUrl:     './home.page.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomePage extends Page implements AfterViewInit, OnDestroy {

  visitor: Visitor = null

  appRoutes = AppRoutes

  private subs: Subscription[] = []

  routeInfo:RouteInfo = {
    page: {
      title: 'Tangential: Home'
    },
    analytics: DefaultPageAnalytics(),
    showAds: false
  }

  constructor(protected bus: MessageBus,
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
    this.router.navigate(AppRoutes.home.navTargets.absSignIn())
  }

  onAnonymousLoginRequest() {
    this.authService.signInAnonymously().then(() => {
      this.router.navigate(AppRoutes.home.navTargets.absTryoutWelcome())
    })
  }
}



