export interface IconIF {
  font: string
  name: string
}

export class Icon implements IconIF {
  font: string
  name: string


  constructor(config?: IconIF) {
    config = config || <any>{}
    this.font = config.font || 'material-icons'
    this.name = config.name || 'question'
  }

  static material(ligature: string): IconIF {
    return {font: 'material-icons', name: ligature}
  }

  static fa(ligature: string): IconIF {
    return {font: 'fa', name: ligature}
  }
}
