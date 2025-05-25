import { Str } from '../../index'

function convertISOToDateObj<T extends object>(obj: object): T {
  return JSON.parse(JSON.stringify(obj), (key: any, value: any) => {
    if (typeof value == 'string' && Str.isDate(value)) {
      return new Date(value)
    }
    return value
  })
}

function convertDateObjToISO<T extends object>(obj: object): T {
  return JSON.parse(JSON.stringify(obj))
}

export const Misc = { convertISOToDateObj, convertDateObjToISO }
