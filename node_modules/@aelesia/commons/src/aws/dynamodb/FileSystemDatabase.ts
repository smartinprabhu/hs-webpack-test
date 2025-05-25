import { NoSQLDatabase } from './NoSQLDatabase'
import * as fs from 'fs'
import { Regex } from '../../collections/Regex'

class File<T> {
  path: string

  constructor(name: string, directory = './db') {
    this.path = `${directory}/${name}.json`
    if (!fs.existsSync(this.path)) {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
      }
      fs.appendFileSync(this.path, JSON.stringify({}))
    }
  }

  read(): Record<string, T> {
    const file = fs.readFileSync(this.path)
    return JSON.parse(file.toString(), (key: any, value: any) => {
      if (typeof value == 'string' && Regex.is.isoDate(value)) {
        return new Date(value)
      }
      return value
    })
  }

  write(object: Record<string, T>): void {
    fs.writeFileSync(this.path, JSON.stringify(object, null, 2))
  }
}

export class FileSystemDatabase<T extends { id: string }> implements NoSQLDatabase<T> {
  readonly table: string
  private db: File<T>

  constructor(table: string, folderDir?: string) {
    this.table = table
    this.db = new File(table, folderDir)
  }

  // TODO: Handle table doesn't exist
  async insert(data: T): Promise<T> {
    const result = this.db.read()
    result[data.id] = data
    this.db.write(result)
    // console.log(`[DB] [${this.table}] Insert { id: ${data.id} }`)
    return data
  }

  async scan(): Promise<T[]> {
    const result = this.db.read()
    return Object.keys(result).map(id => result[id])
  }

  // TODO: Handle table / key doesn't exist
  async select(id: string): Promise<T> {
    let value = this.db.read()[id]
    if (value) {
      return value
    }
    throw Error(`[DB] [${this.table}] No such value: ${id}`)
  }

  // TODO: Handle table / key doesn't exist
  async update(data: { id: string } & Partial<T>): Promise<T> {
    const current_data: T = await this.select(data.id)
    const new_data = { ...current_data, ...data }

    await this.insert(new_data)
    return new_data
  }

  async delete(id: string): Promise<void> {
    const result = this.db.read()
    delete result[id]
    this.db.write(result)
  }

  async deleteAll(): Promise<void> {
    this.db.write({})
  }
}
