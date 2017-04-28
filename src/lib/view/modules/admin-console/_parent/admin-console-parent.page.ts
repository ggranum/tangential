import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {MessageBus} from '@tangential/core'
import {Observable} from 'rxjs/Observable'
import {AuthCdm} from '../../../../authorization-service/media-type/cdm/auth-cdm'
import {AdminService} from '../../../../authorization-service/state/admin-service/admin-service'

@Component({
  selector:        'tanj-admin-console-parent-page',
  template:        '<router-outlet></router-outlet>',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AdminConsoleParentPage {

  @HostBinding('class') clazz = 'tanj-page-component'


  authCdm: AuthCdm
  authCdm$: Observable<AuthCdm>

  constructor(private bus: MessageBus,
              private adminService: AdminService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.authCdm$ = this.adminService.conceptualDataModel$().do((v) => {
      this.authCdm = v
      this.changeDetectorRef.markForCheck()
    })
  }

}

