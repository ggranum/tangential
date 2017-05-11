import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {MessageBus} from '@tangential/core'
import {Observable} from 'rxjs/Observable'
import {Auth} from '@tangential/authorization-service'
import {AdminService} from '@tangential/authorization-service'

@Component({
  selector:        'tanj-admin-console-parent-page',
  template:        '<router-outlet></router-outlet>',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AdminConsoleParentPage {

  @HostBinding('class') clazz = 'tanj-page-component'


  auth: Auth
  auth$: Observable<Auth>

  constructor(private bus: MessageBus,
              private adminService: AdminService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.auth$ = this.adminService.auth$().do((v) => {
      this.auth = v
      this.changeDetectorRef.markForCheck()
    })
  }

}

