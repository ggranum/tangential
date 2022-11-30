export class Guard {
  static isString(value: any | string): value is string {
    return typeof value === 'string'
  }
}
