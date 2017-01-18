
export interface References<T> {
  [key: string]: boolean
}

/**
 * O: Owner
 * R: Reference
 */
export interface OneToMany<O, R> {
  [ownerKey:string]: References<R>
}


export interface ManyToMany<O, R> extends OneToMany<O,R> {}
