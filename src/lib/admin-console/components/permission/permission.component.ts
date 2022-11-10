import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewEncapsulation} from '@angular/core';
import {AuthPermission} from '@tangential/authorization-service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators'


@Component({
  selector:        'tanj-permission',
  templateUrl:     './permission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class PermissionComponent implements OnChanges {

  @Input() permission: AuthPermission

  @Output() change: Observable<{ current: AuthPermission, previous: AuthPermission }>;
  @Output() remove: EventEmitter<AuthPermission> = new EventEmitter<AuthPermission>(false)

  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted = false;
  private _changed: boolean
  private _previous: AuthPermission


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.pipe( debounceTime(10),  distinctUntilChanged())

    this.focus = distinct.pipe(
      filter((v) => v === true),
      map(() => new Event('focus')))

    this.change = distinct.pipe(
      filter((focused) => focused === false && this._changed),
      map(() => {
        const change = {
          previous: this._previous,
          current: this.permission
        }
        this._previous = AuthPermission.from(this.permission)
        this._changed = false
        return change
      }))

    this.blur = distinct.pipe(
      filter((v) => v === false),
      map(() => new Event('blur')))
  }

  ngOnChanges(changes: { permission: SimpleChange }) {
    if (changes.permission) {
      this._previous = AuthPermission.from(this.permission)
      this._changed = false
    }
  }

  fireRemove() {
    this.remove.emit(this.permission)
  }

  onChange(event: Event) {
    event.stopPropagation()
    this._changed = true
  }

  onBlur(event: Event) {
    event.stopPropagation()
    this._focusDebouncer.emit(false)
  }

  onFocus(event: Event) {
    event.stopPropagation()
    this._focusDebouncer.emit(true)

  }

  onSubmit() {
    this.submitted = true;
  }

}
