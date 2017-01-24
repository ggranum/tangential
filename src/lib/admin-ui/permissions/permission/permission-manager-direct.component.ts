import {Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation} from "@angular/core";
import {AuthPermission} from "@tangential/media-types";
import {Observable, BehaviorSubject} from "rxjs";
import {PermissionService} from "@tangential/authorization-service";
import {FirebaseProvider} from "@tangential/firebase";
import {ObjMapUtil, ObjMap} from "@tangential/common";

@Component({
  selector: 'tg-permission-manager-direct',
  template: `
<div *ngFor="let perm of allPermissions$ | async">
{{perm.$key}}: {{perm.description}}
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PermissionManagerDirectComponent implements OnInit {

  allPermissions$: Observable<AuthPermission[]>
  subject: BehaviorSubject<AuthPermission[]>
  private root: firebase.database.Database;

  constructor(private _permissionService: PermissionService, private _fire: FirebaseProvider) {
    this.root = _fire.app.database()
    this.subject = new BehaviorSubject([])
    this.allPermissions$ = this.subject.asObservable()
  }

  ngOnInit() {
    let permissions: AuthPermission[] = []
    this.root.ref('/auth/permissions').on('value', (snap) => {
      // it seems like any update made within the scope of this listener is ignored.
      let permissionsMap: ObjMap<AuthPermission> = snap.val()
      permissions = this.toKeyedEntityArray(permissionsMap)
      console.log('PermissionManagerDirectComponent', 'Permissions updated')
      this.subject.next(permissions)
    })

    // without this interval there are no updates. Even though it does nothing.
    window.setInterval(() => {
      /* Removing the log line does not have any effect, it's just here for convenience. */
      console.log('PermissionManagerDirectComponent', 'heartbeat')
    }, 3000)
  }

  toKeyedEntityArray<V>(map: ObjMap<V>, keyField: string = "$key"): V[] {
    return Object.keys(map).map((key) => {
      let keyObj = {}
      keyObj[keyField] = key
      return Object.assign({}, map[key], keyObj)
    })
  }

  ngOnChanges(changes: any) {
    console.log('PermissionManagerDirectComponent', 'ngOnChanges', Object.keys(changes))
  }


}
