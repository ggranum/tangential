import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChange} from "@angular/core";
import {Observable} from "rxjs";
import {AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tang-permission-component',
  templateUrl: 'permission.component.html',
  styleUrls: ['permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionComponent implements OnChanges {

  @Input() permission: AuthPermission

  @Output() change: Observable<{current: AuthPermission, previous: AuthPermission}>;
  @Output() removePermission: EventEmitter<AuthPermission> = new EventEmitter<AuthPermission>(false)

  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted = false;
  private _changed: boolean
  private _previous: AuthPermission


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.debounceTime(10).distinctUntilChanged()

    this.focus = distinct
      .filter((v) => v === true)
      .map(() => new Event('focus'))

    this.change = distinct
      .filter((focused) => focused === false && this._changed)
      .map(() => {
        let change = {
          previous: this._previous,
          current: this.permission
        }
        this._previous = new AuthPermission(this.permission)
        this._changed = false
        return change
      })

    this.blur = distinct
      .filter((v) => v === false)
      .map(() => new Event('blur'))
  }

  ngOnChanges(changes: {permission:SimpleChange}) {
    if (changes.permission) {
      this._previous = new AuthPermission(this.permission)
      this._changed = false
    }
  }

  doRemovePermission() {
    this.removePermission.emit(this.permission)
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
