import { StringUtil } from './StringUtil'
import dayjs from 'dayjs'

export class DateUtil {
  static now(): Date {
    return new Date()
  }

  static parse(date?: unknown): Date {
    if (date instanceof Date) {
      return date
    } else if (typeof date === 'number') {
      return this.fromTimestamp(date)
    } else if (typeof date === 'string') {
      if (StringUtil.isNum(date)) {
        return this.fromTimestamp(StringUtil._num(date))
      } else {
        const parsedDate = new Date(date)
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate
        }
      }
    } else if (typeof date === 'undefined') {
      return new Date()
    }
    throw new TypeError(`Time: Unable to parse ${date} to date`)
  }

  private static fromTimestamp(timestamp: number): Date {
    if (timestamp <= 99999999999) {
      return new Date(timestamp * 1000)
    }
    return new Date(timestamp)
  }

  /**
   * Returns the number of MILLISECONDS since 1970
   */
  static utc(date: Date = new Date()): number {
    return date.getTime()
  }

  /**
   * Returns the number of SECONDS since 1970
   */
  static epoch(date: Date = new Date()): number {
    return Math.trunc(date.getTime() / 1000)
  }

  static add(ms: number, date: Date = new Date()): Date {
    return new Date(date.getTime() + ms)
  }

  static minus(ms: number, date: Date = new Date()): Date {
    return new Date(date.getTime() - ms)
  }

  /**
   * Returns true if first date is equal to or before second date OR now()
   */
  static isBefore(date: Date, date2: Date): boolean {
    return date.getTime() <= date2.getTime()
  }

  static isAfter(date: Date, date2: Date): boolean {
    return !this.isBefore(date, date2)
  }

  static isPast(date: Date): boolean {
    return this.isBefore(date, new Date())
  }

  static isFuture(date: Date): boolean {
    return !this.isPast(date)
  }

  static _f(date: Date, format: string): string {
    return dayjs(date).format(format)
  }
}
