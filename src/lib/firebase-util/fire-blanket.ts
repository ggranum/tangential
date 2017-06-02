import {
  BehaviorSubject,
  Observable
} from 'rxjs/Rx'
import {Placeholder} from './placeholder'
import DataSnapshot = firebase.database.DataSnapshot
import Query = firebase.database.Query

export type OnRefKey = 'value' | 'child_added' | 'child_removed' | 'child_changed' | 'child_moved'
export const OnRefKeys = {
  value:         <OnRefKey>'value',
  child_added:   <OnRefKey>'child_added',
  child_removed: <OnRefKey>'child_removed',
  child_changed: <OnRefKey>'child_changed',
  child_moved:   <OnRefKey>'child_moved',
}

/**
 * Copy-paste for local use, rather than create a dependency on core.
 */
const isObject = function(value): boolean {
  return (typeof value === 'object' || value.constructor === Object)
}
/**
 * Prevent typescript casting issues while maintaining/enhancing type safety.
 */
export class FireBlanket {

  static util = {

    clean<T>(obj: T, deep:boolean = true): T {
      const cleanObj: T = <T>{}
      Object.keys(obj).forEach((key) => {
        let value = obj[key]
        if (FireBlanket.util.isLegalFirebaseKey(key) && FireBlanket.util.isLegalFirebaseValue(value)) {
          cleanObj[key] = (deep && isObject(value)) ? FireBlanket.util.clean(value) : value
        }
      })
      return cleanObj
    },

    removeIllegalKeys<T>(obj: T): T {
      const cleanObj: T = <T>{}
      Object.keys(obj).forEach((key) => {
        if (FireBlanket.util.isLegalFirebaseKey(key)) {
          cleanObj[key] = obj[key]
        }
      })
      return cleanObj
    },

    isLegalFirebaseKey(key: string): boolean {
      return key !== null && key !== undefined && !key.startsWith('$')
    },

    isLegalFirebaseValue(value: any): boolean {
      return value !== null && value !== undefined
    },

    isFirebaseGeneratedId(key: string): boolean {
      let isKey = false
      // starts with "-" will be true for over a decade.
      if (key && key.length === 20 && key.startsWith('-')) {
        isKey = true
      }
      return isKey
    }

  }

  static value(query: Query, onErrorOrCancelCallback?: (error: any) => any): Promise<DataSnapshot> {
    return <Promise<DataSnapshot>>query.once('value', (snap: DataSnapshot) => snap, onErrorOrCancelCallback)
  }

  static value$(query: Query): Observable<DataSnapshot> {
    const subject = new BehaviorSubject(Placeholder)
    query.on(OnRefKeys.value, (snap: DataSnapshot) => {
      subject.next(snap)
    }, (error: any) => {
      subject.error(error)
    })
    return subject
  }

  static awaitValue$(query: Query): Observable<DataSnapshot> {
    return this.value$(query).filter(v => v !== Placeholder)
  }

  static valueOnce$(query: Query): Observable<DataSnapshot> {
    return this.value$(query).first(v => v !== Placeholder)
  }

  static set<T>(ref: firebase.database.Reference, value: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        ref.set(value, (e: Error) => {
          if (e) {
            reject(e)
          } else {
            resolve()
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  static push<T>(ref: firebase.database.Reference, value: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        ref.push(value, (e: Error) => {
          if (e) {
            reject(e)
          } else {
            resolve()
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  static update<T>(ref: firebase.database.Reference, value: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        ref.update(value, (e: Error) => {
          if (e) {
            reject(e)
          } else {
            resolve()
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  static remove<T>(ref: firebase.database.Reference, onComplete?: (a: Error | null) => any): Promise<void> {
    return <Promise<any>>ref.remove(onComplete)
  }
}
