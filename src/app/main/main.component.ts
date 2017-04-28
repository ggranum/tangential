import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import {
  MdDialog,
  MdDialogRef
} from '@angular/material'
import {
  ActivatedRouteSnapshot,
  Router
} from '@angular/router'
import {
  Logger,
  MessageBus
} from '@tangential/core'
import {Placeholder} from '@tangential/firebase-util'
import {
  Visitor,
  VisitorService
} from '@tangential/visitor-service'
import {Subscription} from 'rxjs/Subscription'
import {AppRoutes} from '../app.routing.module'
import {AppEventMessage} from '../core/bus-events/app-event'
import {NotificationMessage} from '../features/common/notification-bar-component/notification'
import {SideNavComponent} from '../features/common/side-nav/side-nav'

@Component({
  selector:        'tanj-main',
  templateUrl:     'main.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {
  visitor: Visitor
  dialogRef: MdDialogRef<any>

  title = 'Tangential'
  showAds: boolean = false
  adRegion: string


  sideNavOpened: boolean = false
  appRoutes = AppRoutes

  @ViewChild(SideNavComponent) private sideNav: SideNavComponent;

  private visitorWatch: Subscription
  private capturesWatch: Subscription


  constructor(private router: Router,
              private bus: MessageBus,
              private visitorService: VisitorService,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: MdDialog) {
    bus.all.filter(msg => msg.type === AppEventMessage.OpenAppNavRequest).subscribe({
      next: (v) => {
        Logger.debug(this.bus, this, 'MainComponent opening side-nav')
        this.sideNav.open()
      }
    })
  }

  ngOnDestroy() {
    if (this.visitorWatch) {
      this.visitorWatch.unsubscribe()
    }
    if (this.capturesWatch) {
      this.capturesWatch.unsubscribe()
    }
  }

  ngOnInit() {
    this.visitorWatch = this.visitorService.visitor$().filter(v => v !== Placeholder).subscribe((visitor) => {
      Logger.trace(this.bus, this, '#ngOnInit:visitor$', 'Visitor changed', visitor ? visitor.displayName() : 'null')
      this.visitor = visitor
      this.sendStandardNotifications()
      if (visitor.isSignedIn()) {
        // Initialize things, redirect, whatever.
      }
      this.changeDetectorRef.markForCheck()
    })


    this.router.events.subscribe((event: any) => {
      if (event.state) {
        let child: ActivatedRouteSnapshot = event.state.root
        while (child.firstChild) {
          child = child.firstChild
        }
        this.showAds = child.data && child.data['showAds']
        if (this.showAds) {
          this.adRegion = child.url.join('_');
        }
      }
    })
  }

  sendStandardNotifications() {
    if (!this.visitor.prefs.hideCookieWarnings) {
      this.showCookieNotification();
    }
  }

  private showCookieNotification() {

    const notice = NotificationMessage.info({
      message:  'Like nearly all sites, we use Cookies. For more information please see our privacy policy. (click/tap to dismiss)',
      duration: 0
    })
    notice.response(this.bus).subscribe(() => {
      this.visitor.prefs.hideCookieWarnings = true
      this.visitorService.updateVisitorPreferences(this.visitor)
    })
  }

  helpClicked() {
    if (this.dialogRef) {
      this.dialogRef.close(null)
    } else {
      let currentPage = this.router.routerState.snapshot.root
      while (currentPage.firstChild) {
        currentPage = currentPage.firstChild
      }
      const helpComponent = currentPage.data['help']

      if (helpComponent) {

        this.dialogRef = this.dialog.open(helpComponent, {
          height:   '70%',
          width:    '100%',
          position: {
            top: '5em',
          }
        });

        this.dialogRef.afterClosed().subscribe((result: any) => {
          this.dialogRef = null
        });
      }
    }

  }

  doSignIn() {
    this.router.navigate(['./sign-in'])
  }

}



