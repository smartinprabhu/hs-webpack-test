export interface NoSQLDatabase<T extends { id: string }> {
  select: (id: string) => Promise<T>
  insert: (data: T) => Promise<T>
  update: (data: { id: string } & Partial<T>) => Promise<T>
  scan: () => Promise<T[]>
  delete: (id: string) => Promise<void>
  deleteAll: () => Promise<void>
}
