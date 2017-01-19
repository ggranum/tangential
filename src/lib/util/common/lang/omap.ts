export interface ObjMap<T> {
  [key: string]: T
}

export interface OneToManyReferenceMap {
  [one:string]: { [many: string]: boolean }
}

//noinspection JSUnusedGlobalSymbols
export class OMap<K, V> implements Map<K, V>{
  [Symbol.toStringTag];

  [Symbol.iterator](): IterableIterator<[K,V]> {
    return this.delegate[Symbol.iterator]()
  }

  private readonly delegate: Map<K, V>;
  private _modified: boolean
  private _valuesArray: V[]

  static get [Symbol.species]() {
    return OMap;
  }

  constructor(entries?: [K, V][] | Map<K, V> | OMap<K,V>) {
    this._modified = true
    this.delegate = new Map(entries)
    return this
  }

  static toTruthMap<Ks, Vs>(map:Map<Ks,Vs>):OMap<Ks, boolean> {
    let m = new OMap<Ks, boolean>()
    map.forEach((value, key) =>{
      m.set(key, true)
    })
    return m
  }

  get size(): number {
    return this.delegate.size
  }

  get length(): number {
    return this.delegate.size
  }

  entries(): IterableIterator<[K,V]> {
    return this.delegate.entries()
  }

  keys(): IterableIterator<K> {
    return this.delegate.keys()
  }

  values(): IterableIterator<V> {
    return this.delegate.values()
  }

  valuesAry(): V[] {
    this._valuesArray = this._rebuildValuesArray()
    return this._valuesArray
  }

  private _rebuildValuesArray() {
    let values:any[]

    if (this._modified) {
      values = []
      this.delegate.forEach((v:V)=> values.push(v))
      values.sort()
      this._modified = false
    } else {
      values = this._valuesArray
    }
    return values
  }

  clear(): void {
    this._modified = true
    this.delegate.clear()

  }

  //noinspection ReservedWordAsName
  delete(key: K): boolean {
    this._modified = this._modified || this.delegate.has(key)
    return this.delegate.delete(key);
  }

  set(key: K, value?: V): this {
    this._modified = this._modified || !this.delegate.has(key)
    this.delegate.set(key, value)
    return this
  }

  forEach(callbackfn: (value: V, index: K, map: Map<K, V>)=>void, thisArg?: any): void {
    this.delegate.forEach(callbackfn, thisArg)
  }

  get(key: K): V | undefined {
    return this.delegate.get(key)
  }

  has(key: K): boolean {
    return this.delegate.has(key);
  }


  static fromKeyedEntityArray<T>(keyedEntities: T[], keyField:string = "$key"):OMap<string, T> {
    let map = new OMap<string, T>()
    if(keyedEntities){
      for (let i = 0; i < keyedEntities.length; i++) {
        let entity:any = keyedEntities[i]
        map.set(entity[keyField], entity )
      }
    }
    return map
  }
}
