import {
  Observable
} from "rxjs";
import DataSnapshot = firebase.database.DataSnapshot;
import Query = firebase.database.Query;
export type OnRefKey = "value" | "child_added" | "child_removed" | "child_changed" | "child_moved"
export const OnRefKeys = {
  value:         <OnRefKey>"value",
  child_added:   <OnRefKey>"child_added",
  child_removed: <OnRefKey>"child_removed",
  child_changed: <OnRefKey>"child_changed",
  child_moved:   <OnRefKey>"child_moved",
}


export class FireBlanket {

  /**
   * The magic required for us to pass in multiple arguments (e.g. onErrorOrCancelCallback) to the observable
   * callback.
   */
  private static _asBindableCallback(query: Query, cancelCallback?: (error: any) => any): (key: string, cb: () => any) => any {
    return (onRefKey: OnRefKey, cb: (snap: DataSnapshot, b: string) => any) => {
      return query.on(onRefKey, cb, cancelCallback)
    }
  }

  static value(query: Query, onErrorOrCancelCallback?: (error: any) => any): Promise<DataSnapshot> {
    return <Promise<DataSnapshot>>query.once('value', (snap: DataSnapshot) => {
    }, onErrorOrCancelCallback)
  }

  static on(query: Query, onRefKey: OnRefKey = "value", onErrorOrCancelCallback?: (error: any) => any): Promise<DataSnapshot> {
    return <Promise<DataSnapshot>>query.once(onRefKey, (snap: DataSnapshot) => {
    }, onErrorOrCancelCallback)
  }

  static on$(query: Query, onRefKey: OnRefKey = "value", onErrorOrCancelCallback?: (error: any) => any): Observable<DataSnapshot> {
    let cb = FireBlanket._asBindableCallback(query, onErrorOrCancelCallback)
    let observableQuery = Observable.bindCallback(cb)
    return observableQuery(onRefKey)
  }

  static value$(query: Query, onErrorOrCancelCallback?: (error: any) => any): Observable<DataSnapshot> {
    return this.on$(query, 'value', onErrorOrCancelCallback)
  }


  static set<T>(ref: firebase.database.Reference, value: T, onComplete?: (a: Error | null) => any): Promise<void> {
    return <Promise<void>>ref.set(value, onComplete)
  }

  static update<T>(ref: firebase.database.Reference, value: T, onComplete?: (a: Error | null) => any): Promise<any> {
    return <Promise<any>>ref.update(value, onComplete)
  }

  static remove<T>(ref: firebase.database.Reference, onComplete?: (a: Error | null) => any): Promise<any> {
    return <Promise<any>>ref.remove(onComplete)
  }



}
