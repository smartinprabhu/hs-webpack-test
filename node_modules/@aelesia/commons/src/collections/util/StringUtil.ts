import { Regex } from '../Regex'

export class StringUtil {
  static isNum(str: string): boolean {
    return !(this.isBlank(str) || isNaN(str as any))
  }

  static isDate(str: string): boolean {
    return Regex.is.isoDate(str)
  }

  static isBlank(str: string): boolean {
    return !str || !str.trim()
  }

  // static lines(str: string): string[] {
  //   return str.split('\n')
  // }

  static replaceAll(str: string, search: string, replacement: string): string {
    return str.replace(new RegExp(search, 'g'), replacement)
  }

  static remove(str: string, char: string | string[]): string {
    if (typeof char === 'string') {
      return this._remove(str, [char])
    }
    return this._remove(str, char)
  }
  private static _remove(str: string, char: string[]): string {
    for (let i = 0; i < char.length; i++) {
      str = this.replaceAll(str, char[i], '')
    }
    return str
  }

  static _num(str: string): number {
    if (!StringUtil.isNum(str)) {
      throw new TypeError(`StringUtil: Unable to parse '${str}' to number`)
    }
    return Number(str)
  }

  static _json<T>(str: string): T {
    return JSON.parse(str)
  }
}
