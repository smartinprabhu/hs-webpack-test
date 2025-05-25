export class ArrayUtil {
  // Finds the maximum number in an array
  static max(arr: number[]): number {
    // eslint-disable-next-line prefer-spread
    return Math.max.apply(Math, arr)
  }

  // Checks if an array is empty
  static isEmpty<T>(arr: Array<T>): boolean {
    return arr.length === 0
  }

  // Returns a random value from an array
  static random<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  // Returns the first item in an array
  static first<T>(arr: Array<T>): T {
    if (ArrayUtil.isEmpty(arr)) {
      throw Error('Array is empty')
    }
    return arr[0]
  }

  // Returns the last item in an array
  static last<T>(arr: Array<T>): T {
    if (ArrayUtil.isEmpty(arr)) {
      throw Error('Array is empty')
    }
    return arr[arr.length - 1]
  }

  /**
   * reduceKeyFn will return the key that you want T to be sorted to
   * eg. groupBy(['a','ab','b','bb','bc','cc'], it => it[0])
   *     => { a: ['a', 'ab'], b: ['b', 'bb', 'bc'], c: ['cc']}
   * eg. groupBy([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], it => it % 2 === 0 ? 'even' : 'odd')
   *     => { even: [0, 2, 4, 6, 8], odd: [1, 3, 5, 7, 9] }
   * If you want to perform map or filter, please run those functions first before grouping
   */
  static groupBy<T>(arr: Array<T>, reduceKeyFn: (it: T) => Key): Record<Key, T[]> {
    const map: Record<Key, T[]> = {}
    arr.forEach(item => {
      const key = reduceKeyFn(item)
      const collection = map[key]
      if (collection == null) {
        map[key] = [item]
      } else {
        map[key].push(item)
      }
    })
    return map
  }
}
type Key = string | number
