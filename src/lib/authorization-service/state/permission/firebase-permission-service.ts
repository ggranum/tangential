import {EventEmitter, Injectable} from '@angular/core'
import {ObjMapUtil} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase/app'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {PermissionService} from './permission-service'
import DataSnapshot = firebase.database.DataSnapshot;
//noinspection TypeScriptPreferShortImport
import {AuthPermission, AuthPermissionTransform} from '../../media-type/cdm/auth-permission';
//noinspection TypeScriptPreferShortImport
import {AuthPermissionDm, AuthPermissionsFirebaseRef} from '../../media-type/doc-model/auth-permission';


@Injectable()
export class FirebasePermissionService implements PermissionService {
  valueRemoved$: EventEmitter<string> = new EventEmitter<string>(true)

  private db: firebase.database.Database
  private ref: firebase.database.Reference

  constructor(private fb: FirebaseProvider) {
    this.db = fb.app.database()
    this.ref = AuthPermissionsFirebaseRef(this.db)
  }

  private snapMapToValue = (snap: DataSnapshot): AuthPermission[] => {
    let result: AuthPermission[] = []
    if (snap.exists()) {
      result = ObjMapUtil.toKeyedEntityArray(snap.val()).map((permDm:AuthPermissionDm) => AuthPermissionTransform.fromDocModel(permDm, permDm.$key))
    }
    return result
  }

  private snapToValue = (snap: DataSnapshot): AuthPermission => {
    let result: AuthPermission
    if (snap.exists()) {
      result = AuthPermissionTransform.fromDocModel(snap.val(), snap.key)
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
    return FireBlanket.set(cRef, AuthPermissionTransform.toDocModel(child))
  }

  update(child: AuthPermission): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, AuthPermissionTransform.toDocModel(child))
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
