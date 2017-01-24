import {Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation} from "@angular/core";
import {AuthPermission} from "@tangential/media-types";
import {Observable, BehaviorSubject} from "rxjs";
import {PermissionService} from "@tangential/authorization-service";
import {FirebaseProvider} from "@tangential/firebase";
import {ObjMapUtil, ObjMap} from "@tangential/common";

@Component({
  selector: 'tg-permission-manager-direct',
  template: `<tg-data-list [items]="allPermissions$ | async"
              (addItemAction)="onAddItemAction()"
              (removeSelectedAction)="onRemoveSelectedAction($event)">
  <template let-rowItem>
    <tg-permission flex layout="row"
                   [permission]="rowItem"
                   (change)="onItemChange(rowItem)"
                   (remove)="onRemove(rowItem.$key)"></tg-permission>
  </template>

</tg-data-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PermissionManagerDirectComponent implements OnInit {

  allPermissions: AuthPermission[] = []

  allPermissions$:Observable<AuthPermission[]>

  maxPermIndex: number = 0
  private root: firebase.database.Database;

  constructor(private _permissionService: PermissionService, private _fire: FirebaseProvider) {
    this.root = _fire.app.database()
  }

  ngOnInit() {
    let permissions:AuthPermission[] = []
    let subject = new BehaviorSubject([])
    this.allPermissions$ = subject.asObservable()

    this.root.ref('/auth/permissions').on('value', (snap) => {
      let permissionsMap: ObjMap<AuthPermission> = snap.val()
      permissions = ObjMapUtil.toKeyedEntityArray(permissionsMap )
      permissions.sort((a, b) => {
        return a.orderIndex - b.orderIndex
      })
      this.maxPermIndex = permissions.length === 0 ? 0 : permissions[permissions.length - 1].orderIndex
      this.allPermissions = permissions

      console.log('PermissionManagerDirectComponent', 'Permissions updated')
      subject.next(permissions)

    })

    // without this interval there are no updates. Even though it does nothing.
    window.setInterval(()=>{
      /* Removing the log line does not have any effect. It's useful for seeing the order of changes/updates. */
      console.log('PermissionManagerDirectComponent', 'heartbeat')
    }, 3000)
  }


  ngOnChanges(changes:any){
    console.log('PermissionManagerDirectComponent', 'ngOnChanges', Object.keys(changes))
  }


  onAddItemAction() {
    let permission = new AuthPermission({
      $key: 'New Permission ' + (this.maxPermIndex + 1),
      orderIndex: (this.maxPermIndex + 1)
    })
    this._permissionService.create(permission).catch((reason) => {
      console.error('PermissionManagerComponent', 'error adding permission', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    console.log('PermissionManagerComponent', 'onRemove', key)
    this._permissionService.remove(key).catch((reason) => {
      console.error('PermissionManagerComponent', 'error removing permission', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this._permissionService.remove(key).catch((reason) => {
        console.error('PermissionManagerComponent', 'error removing permission', reason)
        throw new Error(reason)
      })
    })
  }


  onItemChange(permission: AuthPermission) {
    console.log('AdminPage', 'onPermissionChange', permission)
    this._permissionService.update(permission, permission).catch((reason) => {
      console.error('PermissionManagerComponent', 'error updating permission', reason)
      throw new Error(reason)
    })

  }

}
