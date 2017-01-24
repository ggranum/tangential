import {Observable, Subscriber} from "rxjs";
import {EventEmitter, NgZone} from "@angular/core";

export interface KeyValueEvent<C> {
  value: C
  key: string
}


/**
 *  @todo ggranum: add cache for '#child' calls.
 */
export class ObservableReference<T, C> {
  private static readonly _noopTransform = (json: any, key: string) => json;
  private static readonly _keyValueTransform = (json: any, key: string) => {
    return {key: key, value: json};
  };
  private _value: {$: Observable<T>, cb: (a: firebase.database.DataSnapshot) => void}
  private _childAdded: {$$: Observable<C>, $: Observable<C>, cb: (a: firebase.database.DataSnapshot) => void}
  private _childRemoved: {$: Observable<C>, cb: (a: firebase.database.DataSnapshot) => void}
  private _childChanged: {$: Observable<C>, cb: (a: firebase.database.DataSnapshot) => void}
  private _childMoved: {$: Observable<C>, cb: (a: firebase.database.DataSnapshot) => void}
  private $ref: firebase.database.Reference

  private _children: Map<string, ObservableReference<any, any>>

  constructor(public path: string,
              public fbApp: firebase.database.Database,
              private transform?: (json: any, key: string) => T,
              private childTransform?: (json: any, key: string) => C|any,
              private _zone?:NgZone
  ) {
    this.$ref = fbApp.ref(path)
    this.transform = this.transform || ObservableReference._noopTransform
    this.childTransform = this.childTransform || ObservableReference._keyValueTransform
    this._children = new Map()
  }

  set zone(zone: NgZone) {
    this._zone = zone
  }

  _errorCallback(e) {
    console.error('ObservableReference', '_errorCallback', e, e ? e.message : '', e ? e.stack : '')
  }

  _fromSnapshot(snap: firebase.database.DataSnapshot): T {
    try {
      let val = snap.val()
      return this.transform(val, snap.key)
    } catch (e) {
      console.error('ObservableReference', '_fromSnapshot error', e.message, e.stack)
    }
  }

  zoned(fn: any) {
    let cb = fn
    if (this._zone) {
      cb = () => {
        this._zone.run(fn)
      }
    }
    return cb()
  }

  get value$(): Observable<T> {
    if (!this._value) {
      this._value = {$: null, cb: null}
      this._value.$ = Observable.create((subscriber: Subscriber<T>) => {
        this._value.cb = (snap: firebase.database.DataSnapshot) => {
          this.zoned(() => {
            try {
              subscriber.next(this._fromSnapshot(snap))
            } catch (e) {
              console.error('ObservableReference', 'callback error', this.path, e.message, e.stack)
              if (snap && snap.val() == null) {
                console.error("ObservableReference", 'snapshot value is null. Hope that helps.')
              }
            }
          })
        }
        this.$ref.on('value', this._value.cb, this._errorCallback)
      })
    }
    return this._value.$
  }

  get childAdded$(): Observable<C> {
    if (!this._childAdded) {
      this._childAdded = {$$: new EventEmitter<C>(), $: null, cb: null}
      this._childAdded.$ = Observable.create((subscriber: Subscriber<KeyValueEvent<C>>) => {
        this._childAdded.cb = (snap: firebase.database.DataSnapshot) => {
          subscriber.next(this.childTransform(snap.val(), snap.key))
        }
        this.$ref.on('child_added', this._childAdded.cb, this._errorCallback)
      })
    }
    return this._childAdded.$
  }

  get childRemoved$(): Observable<C> {
    if (!this._childRemoved) {
      this._childRemoved = {$: null, cb: null}
      this._childRemoved.$ = Observable.create((subscriber: Subscriber<KeyValueEvent<C>>) => {
        this._childRemoved.cb = (snap: firebase.database.DataSnapshot) => {
          subscriber.next(this.childTransform(snap.val(), snap.key))
        }
        this.$ref.on('child_removed', this._childRemoved.cb, this._errorCallback)
      })
    }
    return this._childRemoved.$
  }

  get childChanged$(): Observable<C | {key: string, value: C}> {
    if (!this._childChanged) {
      this._childChanged = {$: null, cb: null}
      this._childChanged.$ = Observable.create((subscriber: Subscriber<KeyValueEvent<C>>) => {
        this._childChanged.cb = (snap: firebase.database.DataSnapshot) => {
          subscriber.next(this.childTransform(snap.val(), snap.key))
        }
        this.$ref.on('child_changed', this._childChanged.cb, this._errorCallback)
      })
    }
    return this._childChanged.$
  }

  get childMoved$(): Observable<C | {key: string, value: C}> {
    if (!this._childMoved) {
      this._childMoved = {$: null, cb: null}
      this._childMoved.$ = Observable.create((subscriber: Subscriber<KeyValueEvent<C>>) => {
        this._childMoved.cb = (snap: firebase.database.DataSnapshot) => {
          subscriber.next(this.childTransform(snap.val(), snap.key))
        }
        this.$ref.on('child_moved', this._childMoved.cb, this._errorCallback)
      })
    }
    return this._childMoved.$
  }

  value(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.$ref.once('value', (snap: firebase.database.DataSnapshot) => {
        resolve(this._fromSnapshot(snap))
      }, (error) => {
        console.error('ObservableReference', 'value', 'error', error)
        reject(error)
      })
    })
  }

  child<C>(childPath: string, transform?: (json: any, key: string) => C): ObservableReference<C, any> {
    let path = this.path + '/' + childPath
    let child = this._children.get(path)
    if (!child) {
      child = new ObservableReference(path, this.fbApp, transform, null, this._zone )
      this._children.set(path, child)
    }
    return child
  }

  set(value: T): Promise<T> {
    if (value === null || value === undefined) {
      throw new Error("Cannot '#set' to null value. You meant '#remove'.")
    }
    return new Promise((resolve, reject) => {
      let actualValue = value['toJson'] ? value['toJson'](false) : value
      this.$ref.set(actualValue, ((error) => {
        if (error) {
          reject(error)
        } else {
          resolve(value)
          this.destroy()
        }
      }))
    })
  }

  remove(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.$ref.remove((error) => {
        if (error) {
          reject(error)
        } else {
          resolve(this.$ref.key)
          this.destroy()
        }
      })
    })
  }

  off() {
    if (this._value) {
      this.$ref.off('value', this._value.cb)
      delete this._value
    }
    if (this._childAdded) {
      this.$ref.off('child_added', this._childAdded.cb)
      delete this._childAdded
    }
    if (this._childRemoved) {
      this.$ref.off('child_removed', this._childRemoved.cb)
      delete this._childRemoved
    }
    if (this._childChanged) {
      this.$ref.off('child_changed', this._childChanged.cb)
      delete this._childChanged
    }
    if (this._childMoved) {
      this.$ref.off('child_moved', this._childMoved.cb)
      delete this._childMoved
    }
  }

  destroy() {
    this.off()
    this._children.forEach((child) => {
      child.destroy()
    })
  }
}
