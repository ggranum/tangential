export interface ObjMap<T> {
  [key: string]: T
}

export interface OneToManyReferenceMap {
  [one: string]: { [many: string]: boolean }
}
