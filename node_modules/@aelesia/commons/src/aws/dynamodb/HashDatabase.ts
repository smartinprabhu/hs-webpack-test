import { NoSQLDatabase } from './NoSQLDatabase'

export class HashDatabase<T extends { id: string }> implements NoSQLDatabase<T> {
  readonly table: string
  private db: Record<string, T> = {}

  constructor(table: string) {
    this.table = table
  }

  // TODO: Handle table doesn't exist
  async insert(data: T): Promise<T> {
    this.db[data.id] = data
    // console.log(`[DB] [${this.table}] Insert { id: ${data.id} }`)
    return data
  }

  async scan(): Promise<T[]> {
    return Object.keys(this.db).map(id => this.db[id])
  }

  async select(id: string): Promise<T> {
    let value = this.db[id]
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
    delete this.db[id]
  }

  async deleteAll(): Promise<void> {
    this.db = {}
  }
}
