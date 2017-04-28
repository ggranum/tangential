export class ArrayUtils {

  static peek<T>(ary: T[]): T {
    let v
    if (ary && ary.length) {
      v = ary[ary.length - 1]
    }
    return v
  }
}
