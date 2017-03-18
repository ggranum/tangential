import {AuthPermission} from "@tangential/media-types";
import {EventEmitter, Injectable} from "@angular/core";
import {FirebaseProvider, FireBlanket} from "@tangential/firebase-util";
import {PermissionService} from "./permission-service";
import {Observable} from "rxjs";
import {ObjMapUtil} from "@tangential/common";
import * as firebase from "firebase/app";
import DataSnapshot = firebase.database.DataSnapshot;


@Injectable()
export class FirebasePermissionService implements PermissionService {
  valueRemoved$: EventEmitter<string> = new EventEmitter<string>(true)

  private path: string =  "/auth/permissions"
  private db:firebase.database.Database
  private ref: firebase.database.Reference

  constructor(private fb:FirebaseProvider) {
    this.db = fb.app.database()
    this.ref = this.db.ref(this.path)
  }

  private snapMapToValue = (snap:DataSnapshot):AuthPermission[] => {
    let result:AuthPermission[] = []
    if(snap.exists()){
      result = ObjMapUtil.toKeyedEntityArray(snap.val()).map(permJson => {
        return new AuthPermission(permJson)
      })
    }
    return result
  }

  private snapToValue = (snap:DataSnapshot):AuthPermission => {
    let result:AuthPermission
    if(snap.exists()){
      result = new AuthPermission(snap.val(), snap.key)
    }
    return result
  }

  value(childKey: string): Promise<AuthPermission> {
    let cRef = this.ref.child(childKey)
    return FireBlanket.value(cRef).then(this.snapToValue)
  }

  values$(): Observable<AuthPermission[]> {
    return FireBlanket.value$(this.ref).map(this.snapMapToValue)
  }

  valuesOnce(): Promise<AuthPermission[]> {
    return FireBlanket.value(this.ref).then(this.snapMapToValue)

  }

  create(child: AuthPermission): Promise<AuthPermission> {
    let cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false)).then(() => child)

  }

  update(child: AuthPermission): Promise<AuthPermission> {
    let cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false)).then(() => child)
  }

  remove(childKey: string): Promise<string> {
    let cRef = this.ref.child(childKey)
    return FireBlanket.remove(cRef).then(() =>{
      this.valueRemoved$.next(childKey)
      return childKey
    })
  }

  destroy(): void { }


}
