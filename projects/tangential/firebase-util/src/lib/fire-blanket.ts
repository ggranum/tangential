import {DatabaseReference, Query, DataSnapshot} from '@firebase/database'
import { set, push, remove, update, onValue } from 'firebase/database'
import {BehaviorSubject, Observable} from 'rxjs'
import {filter, first} from 'rxjs/operators'

import {Placeholder} from './placeholder'

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
const isObject = function (value: any): boolean {
  return (typeof value === 'object' || value['constructor'] === Object)
}

/**
 * Prevent typescript casting issues while maintaining/enhancing type safety.
 */
export class FireBlanket {

  static util = {

    clean<T extends object>(obj: T, deep: boolean = true): T {
      const cleanObj: T = <T>{}
      Object.keys(obj).forEach((key) => {
        let value = (obj as any)[key]
        if (FireBlanket.util.isLegalFirebaseKey(key) && FireBlanket.util.isLegalFirebaseValue(value)) {
          (cleanObj as any)[key] = (deep && isObject(value)) ? FireBlanket.util.clean(value) : value
        }
      })
      return cleanObj
    },

    removeIllegalKeys<T extends object>(obj: T): T {
      const cleanObj: T = <T>{}
      Object.keys(obj as any).forEach((key) => {
        if (FireBlanket.util.isLegalFirebaseKey(key)) {
          (cleanObj as any)[key] = (obj as any)[key]
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

  /**
   * Read the value once and return.
   * @param query
   */
  static value(query: Query): Promise<DataSnapshot> {
    return new Promise<DataSnapshot>((resolve, reject) => {
      onValue(query, (snap: DataSnapshot) => {
        resolve(snap);
      }, {
        onlyOnce: true
      });
    });
  }

  static value$(query: Query): Observable<DataSnapshot> {
    const subject = new BehaviorSubject(Placeholder); // this semicolon is required.

    /** @todo: ggranum: The unsubscribe is hacky, and won't actually remove the firebase
     * listener unless there is a 'next' element called
     * @maybeBug: Possible memory leak for long-running sessions with many value listeners
     * */
      (subject as any)['_firebaseUnsubscribe'] = onValue(query, (snap: DataSnapshot) => {
      if(subject.closed){
        (subject as any)['_firebaseUnsubscribe']()
        delete (subject as any)['_firebaseUnsubscribe']
      }
      subject.next(snap)
    }, (error: any) => {
      subject.error(error)
    })
    return subject
  }

  static awaitValue$(query: Query): Observable<DataSnapshot> {
    return this.value$(query).pipe(filter(v => v !== Placeholder))
  }

  static valueOnce$(query: Query): Observable<DataSnapshot> {
    return this.value$(query).pipe(first(v => v !== Placeholder))
  }

  static set<T>(ref: DatabaseReference, value: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        set(ref, value).then(() => {}).catch((e: Error) => {
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

  static push<T>(ref: DatabaseReference, value: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        push(ref, value).catch((e: Error) => {
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

  static update<T extends object>(ref: DatabaseReference, value: T): Promise<void> {
       return update(ref, value )
  }

  static remove<T>(ref: DatabaseReference): Promise<void> {
    return remove(ref)
  }
}
