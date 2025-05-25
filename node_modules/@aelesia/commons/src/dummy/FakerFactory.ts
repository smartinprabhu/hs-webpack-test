export class FakerFactory<T> {
  private factory: () => T
  private _fixture: Map<string | number, T> | undefined

  constructor(factory: () => T) {
    this.factory = factory
  }

  new(override?: Partial<T>): T {
    if (!override) {
      return this.factory()
    }
    return { ...this.factory(), ...override }
  }

  array(total: number, override?: Partial<T> | ((index: number) => Partial<T>)): T[] {
    const arr: T[] = []
    for (let i = 0; i < total; i++) {
      if (typeof override === 'function') {
        arr.push(this.new(override(i)))
      } else {
        arr.push(this.new(override))
      }
    }
    return arr
  }

  /**
   * Returns the same object
   */
  fixture(id: string | number, override?: Partial<T>): T {
    if (!this._fixture) {
      this._fixture = new Map()
    }
    if (!this._fixture.get(id)) {
      this._fixture.set(id, this.new(override))
    }
    if (!override) {
      return this._fixture.get(id) as T
    }
    return { ...(this._fixture.get(id) as T), ...override }
  }
}
