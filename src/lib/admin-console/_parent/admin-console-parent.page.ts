import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation
} from '@angular/core'
import {
  AdminService,
  Auth
} from '@tangential/authorization-service'
import {MessageBus} from '@tangential/core'
import {Observable} from 'rxjs/Observable'

@Component({
  selector:        'tanj-admin-console-parent-page',
  template:        '<router-outlet></router-outlet>',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AdminConsoleParentPage {


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

