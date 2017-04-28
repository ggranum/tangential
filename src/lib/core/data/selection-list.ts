export class SelectionEntry<T> {

  constructor(public value: T, public selected: boolean = false, public disabled: boolean = false) {
  }
}

export class SelectionList<T> {
  entries: SelectionEntry<T>[]

  constructor(initialValues: T[] = [], selectAll: boolean = false, public keyField: string = '$key') {
    this.entries = initialValues.map((v) => {
      return new SelectionEntry(v, selectAll)
    })
  }

  asIndexMap() {
    const indices: { [key: string]: number } = {}
    this.entries.forEach((entry, index) => {
      indices[entry.value[this.keyField]] = index
    })
    return indices
  }

  select(values: T[]) {
    const map = this.asIndexMap()
    values.forEach((value: T) => {
      const index: number = map[value[this.keyField]]
      if (index || index === 0) {
        this.entries[index].selected = true
      }
    })
  }

  disable(values: T[]) {
    const map = this.asIndexMap()
    values.forEach((value: T) => {
      const index: number = map[value[this.keyField]]
      if (index || index === 0) {
        this.entries[index].disabled = true
      }
    })
  }
}
