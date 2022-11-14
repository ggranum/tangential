import {
  ObjMap,
  TimeUnit,
  TimeUnits
} from '@tangential/core'
import {Duration} from 'moment'
import * as moment from 'moment/moment'
export class DurationPickerFieldsState {
  index: number = 0
  unit: TimeUnit = TimeUnits.h
  selected: boolean = false
  next: DurationPickerFieldsState | undefined
  previous: DurationPickerFieldsState | undefined

  constructor(public picker: DurationPickerState, unit: TimeUnit) {
    this.unit = unit
    this.selected = false
  }

  get label(): string {
    return this.unit.label
  }

  canSelect(): boolean {
    let can: boolean
    const count = this.picker.selectedCount()
    if (count >= 3) {
      can = false
    } else if (count === 0) {
      can = true
    } else {
      can = this.previous?.selected || this.next?.selected || false
    }
    return can
  }

  canDeselect(): boolean {
    /* If next and previous are selected then you cannot deselect this one. */
    return (!this.previous || !this.next || !this.previous.selected || !this.next.selected)
  }

  canToggleSelection() {
    return this.selected ? this.canDeselect() : this.canSelect()
  }


  get value(): number {
    let result: number
    if (this.previous && this.previous.selected) {
      result = this.picker.duration.get(this.unit.momentKey)
    } else {
      result = this.picker.duration.as(this.unit.momentKey)
    }
    return Math.floor(result)
  }

  set value(val: number) {
    if (val >= 0) {
      const prev = this.value
      this.picker.duration.add(val - prev, this.unit.momentKey)
    }
  }

  get separator(): string {
    return this.unit.separatorSuffix
  }

  get max(): number {
    return (this.previous && this.previous.selected) ? this.unit.logicalMax : 9999
  }
}
/** @todo: ggranum: Remove use of MomentJS if possible. */
export class DurationPickerState {

  public fields: DurationPickerFieldsState[] = []
  fieldsByKey: ObjMap<DurationPickerFieldsState> = {}
  duration: Duration = moment.duration(0)
  max: number = 100


  constructor() {
    this.fields = [
      new DurationPickerFieldsState(this, TimeUnits.day), new DurationPickerFieldsState(this, TimeUnits.h),
      new DurationPickerFieldsState(this, TimeUnits.min), new DurationPickerFieldsState(this, TimeUnits.s),
      new DurationPickerFieldsState(this, TimeUnits.ms), ]
    for (let i = 0; i < this.fields.length; i++) {
      const f = this.fields[i]
      f.next = this.fields[i + 1]
      f.previous = this.fields[i - 1]
      f.index = i
      this.fieldsByKey[f.unit.unitKey] = f

    }
  }

  selectedFields(): DurationPickerFieldsState[] {
    return this.fields.filter(f => f.selected)
  }

  selectedCount(): number {
    return this.selectedFields().length
  }


  setDuration(duration: Duration) {
    this.duration = duration
  }

  select(unit: TimeUnit) {
    this.fieldsByKey[unit.unitKey].selected = true
  }

  get millis(): number {
    return this.duration.asMilliseconds()
  }
}
