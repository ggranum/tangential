export class ArrayUtils {

  static peek<T>(ary: T[]): T | undefined {
    let v: T | undefined = undefined
    if (ary && ary.length) {
      v = ary[ary.length - 1]
    }
    return v
  }
}
