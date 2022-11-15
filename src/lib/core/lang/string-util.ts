export class StringUtil {

  static _baseTen = [true, true, true, true, true, true, true, true, true, true]

  static firstUniqueByCounterSuffix(value: string, values: string[], separatorChar: string = ' ') {
    let result = value
    const map: { [key: string]: boolean } = {}
    values.forEach(v => map[v] = true)
    let idx = 1
    while (map[result]) {
      result = value + separatorChar + idx++
    }
    return result
  }


  /**
   * Split a string that ends with a number into its corresponding parts. Useful for name collisions, e.g.
   * FooValue, FooValue-1, FooValue-2
   * @param value
   */
  static withoutNumericSuffix(value: string): { text: string, suffix?: number } {
    let idx = value.length
    const suffixChars = []
    for (idx; idx--; idx > 0) {
      if ((StringUtil._baseTen as any)[value.charAt(idx)] !== true) {
        break;
      }
      suffixChars.unshift(value.charAt(idx))
    }
    const suffixValue = suffixChars.length ? Number.parseInt(suffixChars.join('')) : undefined
    const text = value.substring(0, idx)
    return {text: text.trim(), suffix: suffixValue}
  }

  static incrementCounterSuffix(value: string) {
    let result = value
    let suffixValue = 1
    const suffixChars = []
    let idx = value.length

    for (idx; idx--; idx > 0) {
      if ((StringUtil._baseTen as any)[value.charAt(idx)] !== true) {
        break;
      }
      suffixChars.unshift(value.charAt(idx))
    }
    if (suffixChars.length) {
      try {
        suffixValue = Number.parseInt(suffixChars.join(''))
        result = value.substring(0, idx + 1)
      } catch (e) {
        suffixValue = 1;
      }
    }
    return result + (suffixValue + 1)


  }
}
