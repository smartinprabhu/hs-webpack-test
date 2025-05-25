export class Format {
  static email(value: string): string
  static email(value: unknown): string {
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
    console.warn(new TypeError(`Unable to parse value as string: ${value}`))
    return 'ERR'
  }
  static timeAgo(ms: number): string
  static timeAgo(ms: unknown): string {
    if (typeof ms === 'number') {
      if (ms < 60000) {
        return `${Math.floor(ms / 1000)} seconds`
      } else if (ms < 3600000) {
        return `${Math.floor(ms / 60000)} minutes`
      } else if (ms < 86400000) {
        return `${Math.floor(ms / 3600000)} hours`
      } else {
        return `${Math.floor(ms / 86400000)} days`
      }
    }
    console.warn(new TypeError(`Unable to parse value as number: ${ms}`))
    return 'ERR'
  }
}
