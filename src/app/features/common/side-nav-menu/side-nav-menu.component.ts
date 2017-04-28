import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChange, ViewEncapsulation} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '@tangential/authorization-service'
import {MessageBus} from '@tangential/core'
import {Visitor} from '@tangential/visitor-service'
import {AppRoutes} from '../../../app.routing.module'
import {ContextMenuItem, ContextMenuMessage} from './context-menu-message'

@Component({
  selector:        'tanj-side-nav-menu',
  templateUrl:     './side-nav-menu.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host:            {
    '(click)': 'onMenuBodyClick()'
  }
})
export class SideNavMenuComponent implements OnChanges {

  @Input() visitor: Visitor = null

  appRoutes = AppRoutes
  contextMenuItems: ContextMenuItem[] = []

  constructor(private bus: MessageBus,
              private router: Router,
              private visitorService: AuthService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.subscribe()
  }

  private subscribe() {
    ContextMenuMessage.filter(this.bus).subscribe({
      next: (v) => {
        this.contextMenuItems = v.menuItems
        this.changeDetectorRef.markForCheck()
      }
    })
  }


  public ngOnChanges(changes: { visitor: SimpleChange }): void {
    if (changes.visitor && this.visitor) {
    }
  }

  onMenuBodyClick() {
  }

  onSignOutRequest() {
    this.visitorService.signOut().then(() => {
      this.router.navigate(AppRoutes.home.navTargets.absSelf)
    })
  }

  onTryoutRequest() {
    this.visitorService.signInAnonymously().then(() => {
      this.router.navigate(AppRoutes.home.navTargets.absTryoutWelcome())
    })
  }


}
