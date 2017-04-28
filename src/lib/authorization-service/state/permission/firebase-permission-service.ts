import {EventEmitter, Injectable} from '@angular/core'
import {ObjMapUtil} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase/app'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/auth/auth-permission'
import {PermissionService} from './permission-service'
import DataSnapshot = firebase.database.DataSnapshot;


@Injectable()
export class FirebasePermissionService implements PermissionService {
  valueRemoved$: EventEmitter<string> = new EventEmitter<string>(true)

  private path: string = '/auth/permissions'
  private db: firebase.database.Database
  private ref: firebase.database.Reference

  constructor(private fb: FirebaseProvider) {
    this.db = fb.app.database()
    this.ref = this.db.ref(this.path)
  }

  private snapMapToValue = (snap: DataSnapshot): AuthPermission[] => {
    let result: AuthPermission[] = []
    if (snap.exists()) {
      result = ObjMapUtil.toKeyedEntityArray(snap.val()).map(permJson => {
        return new AuthPermission(permJson)
      })
    }
    return result
  }

  private snapToValue = (snap: DataSnapshot): AuthPermission => {
    let result: AuthPermission
    if (snap.exists()) {
      result = new AuthPermission(snap.val(), snap.key)
    }
    return result
  }

  value(childKey: string): Promise<AuthPermission> {
    const cRef = this.ref.child(childKey)
    return FireBlanket.value(cRef).then(this.snapToValue)
  }

  permissions$(): Observable<AuthPermission[]> {
    return FireBlanket.awaitValue$(this.ref).map(this.snapMapToValue)
  }

  valuesOnce(): Promise<AuthPermission[]> {
    return FireBlanket.value(this.ref).then(this.snapMapToValue)

  }

  create(child: AuthPermission): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false))
  }

  update(child: AuthPermission): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false))
  }

  remove(childKey: string): Promise<void> {
    const cRef = this.ref.child(childKey)
    return FireBlanket.remove(cRef).then(() => {
      this.valueRemoved$.next(childKey)
    })
  }

  destroy(): void {
  }


}
