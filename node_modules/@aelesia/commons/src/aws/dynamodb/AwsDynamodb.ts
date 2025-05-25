import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import { NoSQLDatabase } from './NoSQLDatabase'
import { NotImplementedErr } from '../../error/Error'
import { Misc } from '../../collections/Misc'

export class AwsDynamodb<T extends { id: string }> implements NoSQLDatabase<T> {
  ddb: DocumentClient
  table: string

  constructor(region: string, table: string) {
    AWS.config.update({ region })
    this.ddb = new AWS.DynamoDB.DocumentClient()
    this.table = table
  }

  async select(id: string): Promise<T> {
    const params = {
      TableName: this.table,
      Key: { id }
    }
    return new Promise((resolve, reject) => {
      this.ddb.get(params, (err: any, data: any) => {
        if (err) {
          reject(err)
        } else if (!data || !data.Item) {
          reject(new Error(`No items retrieved from: ${this.table} : {id:${id}}`))
        } else {
          resolve(Misc.convertISOToDateObj<T>(data.Item))
        }
      })
    })
  }

  // FIXME: Sanitize keys with empty/null/undefined values
  async insert(data: T): Promise<T> {
    const params = {
      TableName: this.table,
      Item: Misc.convertDateObjToISO<T>(data)
    }
    return new Promise((resolve, reject) => {
      this.ddb.put(params, (err: any, _data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async scan(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.ddb.scan({ TableName: this.table }, (err: any, data: any) => {
        if (err) {
          reject(err)
        } else if (!data || !data.Items || data.Items.length <= 0) {
          resolve([])
        } else {
          resolve(Misc.convertISOToDateObj<T[]>(data.Items))
        }
      })
    })
  }

  async update(data: { id: string } & Partial<T>): Promise<T> {
    const current_data: T = await this.select(data.id)
    const new_data = { ...current_data, ...data }

    await this.insert(new_data)
    return new_data
  }

  async delete(id: string): Promise<void> {
    // console.log({ TableName: this.table, Key: { id: id } })
    return new Promise((resolve, reject) => {
      this.ddb.delete({ TableName: this.table, Key: { id } }, (err: any, _data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async deleteAll(): Promise<void> {
    throw new NotImplementedErr('AwsDynamodb.deleteAll() has not yet been implemented')
  }
}
