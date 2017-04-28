import {IconIF} from '@tangential/components'

export interface ColumnHeader {
  captureKey: string, inputKey: string, label: string, icon: IconIF, index: number
}

export class DataTable {
  title: string = ''
  headers: ColumnHeader[] = []
  dataByColumn: any[][] = []
  dataByRow: any[][] = []


  toCsv(): string {
    let rows = []
    rows.push(this.headers.map(header => header.label))
    rows = rows.concat(this.dataByRow)
    rows = rows.map(row => row.map((cell: string) => {
      cell = '' + cell
      return `"${cell.replace('"', '""')}"`
    }))
    const rowStrings = []
    rows.forEach(function (row) {
      rowStrings.push(row.join(','))
    });
    return rows.join('\n')
  }

  toCsvDataLink(): string {
    return 'data:text/csv;charset=utf-8,' + this.toCsv()
  }

}
