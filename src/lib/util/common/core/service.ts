import {Observable} from "rxjs";


export interface TgServiceIF<T> {
  values(): Observable<T[]>
  valuesOnce(): Promise<T[]>
  setEntities(entities: T[]): Promise<void>
  create(entity: T): Promise<T>
  value(entityKey: string): Promise<T>
  update(current: T, previous?: T): Promise<T>
  remove(entityKey: string): Promise<string>
  destroy(): void

}

export abstract class TgService<T> implements TgServiceIF<T> {
  abstract values(): Observable<T[]>
  abstract valuesOnce(): Promise<T[]>
  abstract setEntities(entities: T[]): Promise<void>
  abstract create(entity: T): Promise<T>
  abstract value(entityKey: string): Promise<T>
  abstract update(current: T, previous: T): Promise<T>
  abstract remove(entityKey: string): Promise<string>
  abstract destroy(): void
}
