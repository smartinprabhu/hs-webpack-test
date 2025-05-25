// TODO: Allow objects to be passed in

/**
 * When something was stubbed but the implementation was not written yet.
 * To prevent failing silently.
 */
export class NotImplementedErr extends Error {
  constructor(msg?: string) {
    super(`NotImplementedError: ${msg ?? ''}`)
    Object.setPrototypeOf(this, NotImplementedErr.prototype)
  }
}

/**
 * When something was expected to be initialized but was null / undefined
 */
export class UninitializedErr extends Error {
  constructor(msg?: string) {
    super(`UninitializedError: ${msg ?? ''}`)
    Object.setPrototypeOf(this, UninitializedErr.prototype)
  }
}

/**
 * When the machine somehow entered a state that should not be possible based on business rules
 */
export class IllegalStateErr extends Error {
  constructor(msg?: string) {
    super(`IllegalStateException: ${msg ?? ''}`)
    Object.setPrototypeOf(this, IllegalStateErr.prototype)
  }
}

/**
 * When a parameter was passed in that should not be allowed based on business rules
 */
export class IllegalArgumentErr extends Error {
  constructor(msg?: string) {
    super(`IllegalArgumentException: ${msg ?? ''}`)
    Object.setPrototypeOf(this, IllegalArgumentErr.prototype)
  }
}
