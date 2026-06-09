import 'server-only'
import { BigQuery } from '@google-cloud/bigquery'

let client: BigQuery | null = null

export function getBigQuery(): BigQuery {
  if (!client) {
    const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    if (!raw) throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not set')
    const credentials = JSON.parse(raw)
    client = new BigQuery({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials,
    })
  }
  return client
}

export async function runQuery<T = Record<string, unknown>>(
  sql: string
): Promise<T[]> {
  const bq = getBigQuery()
  const [rows] = await bq.query({ query: sql, location: 'US' })
  return rows as T[]
}
