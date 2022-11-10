import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {ObjMapUtil} from '@tangential/core';

@Component({
  selector: 'tanj-data-list-expander', template: ``, changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataListExpander {
  @ContentChild(TemplateRef) template: TemplateRef<any>;

}

@Component({
  selector:        'tanj-data-list',
  templateUrl:     './data-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class DataListComponent implements OnChanges {

  @Input() items: any[] = []
  @Input() keyField: string = '$key'

  @Output() addItemAction: EventEmitter<void> = new EventEmitter<void>(false)
  @Output() removeSelectedAction: EventEmitter<string[]> = new EventEmitter<string[]>(false)
  @Output() selectionChange: EventEmitter<string[]> = new EventEmitter<string[]>(false)
  @Output() expansionChange: EventEmitter<string[]> = new EventEmitter<string[]>(false)

  expansionCount: number = 0
  selectionCount: number = 0

  private _selections: { [key: string]: boolean } = {}
  private _expansions: { [key: string]: boolean } = {}

  @ContentChild(TemplateRef) rowTemplate: TemplateRef<any>;
  @ContentChild(DataListExpander) expander: DataListExpander;

  constructor() {
  }

  ngOnChanges(changes: { items: SimpleChange }) {
    if (changes.items) {
      this.updateSelections()
    }
  }

  updateSelections() {
    if (this.selectionCount !== 0) {
      const map = ObjMapUtil.fromKeyedEntityArray(this.items)
      Object.keys(this._selections).forEach(key => {
        if (!map[key]) {
          delete this._selections[key]
          this.selectionCount--
        }
      })
    }
  }

  isExpanded(itemKey: string) {
    return this._expansions[itemKey] === true
  }

  toggleExpanded(itemKey: string) {
    this.expansionCount += this.toggle(itemKey, this._expansions, this.expansionChange)
  }

  isSelected(itemKey: string) {
    return this._selections[itemKey] === true
  }

  selectItem(itemKey: string) {
    this.toggleSelected(itemKey)
  }

  deselectItem(itemKey: string) {
    this.toggleSelected(itemKey)
  }

  toggleSelected(itemKey: string) {
    const wasActive = this._selections[itemKey]
    if (wasActive) {
      delete this._selections[itemKey]
      this.selectionCount--
    } else {
      this._selections[itemKey] = true
      this.selectionCount++
    }
    this.selectionChange.emit(Object.keys(this._selections))
  }

  toggle(itemKey: string, target: any, emitter: EventEmitter<any>) {
    let countIncrement = 0
    const wasActive = target[itemKey]
    if (wasActive) {
      delete target[itemKey]
      countIncrement = -1
    } else {
      target[itemKey] = true
      countIncrement = 1
    }
    emitter.emit(Object.keys(target))
    return countIncrement
  }


  onSelectAllCheckAction(isChecked: boolean) {
    if (isChecked) {
      this.selectionCount = 0;
      this._selections = {}
    } else {
      this.items.forEach(item => this._selections[item.$key] = true)
      this.selectionCount = this.items.length
    }
    this.selectionChange.emit(Object.keys(this._selections))
  }

  fireAddItemAction() {
    this.addItemAction.emit()
  }

  fireRemoveSelectedAction() {
    this.removeSelectedAction.emit(Object.keys(this._selections))

  }

}
