import { DateUtil } from './src/collections/util/DateUtil'
import { StringUtil } from './src/collections/util/StringUtil'
import { ArrayUtil } from './src/collections/util/ArrayUtil'
import { RandomUtil } from './src/collections/util/RandomUtil'
import { TimeUtil } from './src/collections/util/TimeUtil'
import { Format } from './src/collections/Format'
import { Regex } from './src/collections/Regex'
import { Misc } from './src/collections/Misc'
import { loop, sleep, Throw, env } from './src/general/Control'
import * as Err from './src/error/Error'
import { ObjectUtil } from './src/collections/util/ObjectUtil'

export const _ = {
  date: DateUtil,
  arr: ArrayUtil,
  str: StringUtil,
  rand: RandomUtil,
  obj: ObjectUtil,
  time: TimeUtil,
  format: Format,
  regex: Regex
}
export {
  DateUtil as Date_,
  ArrayUtil as Arr,
  StringUtil as Str,
  RandomUtil as Rand,
  TimeUtil as Time,
  ObjectUtil as Obj,
  Format,
  Regex,
  Misc
}

// Dummy
export { FakerFactory } from './src/dummy/FakerFactory'
export { Patch } from './src/dummy/Patch'

// Error
export { Err }
export { loop, sleep, Throw, env }
