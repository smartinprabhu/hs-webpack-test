/**
 * @experimental
 */
export class Patch<T> {
  singleton: T
  mock: T

  constructor(singleton: T, mock: T) {
    this.singleton = singleton
    this.mock = mock
  }

  override() {
    Object.keys(this.mock).forEach(func => {
      // @ts-ignore
      this.singleton[func] = this.mock[func]
    })
  }
}
