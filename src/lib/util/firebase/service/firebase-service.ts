import {generatePushID, ToJson, Keyed, ObjMap, ObjMapUtil, TgServiceIF} from "@tangential/common";
import {Observable} from "rxjs";

//noinspection TypeScriptPreferShortImport
import {ObservableObjMapReference} from "../observable-objmap-reference";
import {EventEmitter} from "@angular/core";

export abstract class FirebaseService<T extends Keyed & ToJson> implements TgServiceIF<T> {

  public readonly $ref: ObservableObjMapReference<T>
  public readonly valueRemoved$:EventEmitter<string>
  constructor(public readonly path:string, public readonly fbApp: firebase.database.Database, private readonly transform?: (json: any, key: string) => T) {
    this.$ref = new ObservableObjMapReference<T>(path, fbApp, transform)
    this.valueRemoved$ = new EventEmitter<string>(true)
  }

  /**
   * Replaces all. Scary.
   * @param entities
   * @returns {Promise<void>}
   */
  setEntities(entities: T[]): Promise<void> {
    let mapped = ObjMapUtil.fromKeyedEntityArray(entities)
    Object.keys(mapped).map((key:string) =>{
        mapped[key] = mapped[key].toJson(false)
    })
    return this.$ref.set(mapped).then((value) => null)
  }

  destroy(): void {
    this.$ref.destroy()
  }

  value(childKey: string): Promise<T> {
    return this.$ref.child(childKey, this.transform).value()
  }

  values(): Observable<T[]> {
    return this.$ref.value$.map((values: ObjMap<T>) => {
      return ObjMapUtil.toArray(values)
    })
  }

  valuesOnce(): Promise<T[]> {
    return this.$ref.value().then((values: ObjMap<T>) => {
      try{
        return ObjMapUtil.toArray(values)
      } catch (e){
        console.error('FirebaseService', 'valuesOnce', e)
      }
    })
  }

  create(entity: T): Promise<T> {
    if (!entity.$key) {
      try{
        entity.$key = generatePushID()
      }
      catch(e) {
        console.log('FirebaseService', 'create', 'error', e)
      }
    }
    return this.$ref.child(entity.$key, this.transform).set(entity)
  }

  update(current: T, previous?: T): Promise<T> {
    // will need 'previous' for updating keys if we allow that.
    // if previous.key != current.key then this is a 'drop-recreate' rather than an update.
    return this.$ref.child(current.$key).set(current.toJson()).then(() => current)
  }

  remove(entityKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.$ref.child(entityKey, this.transform).remove().then((removedKey)=>{
        this.valueRemoved$.next(removedKey)
        resolve(removedKey)
      }).catch((reason)=>{
        reject(reason)
      })
    });
  }
}
