import 'server-only'
import { getBigQuery } from '@/lib/bigquery'

const BLOCKED_KEYWORDS = [
  'INSERT', 'UPDATE', 'DELETE', 'MERGE', 'DROP', 'ALTER', 'CREATE',
  'TRUNCATE', 'GRANT', 'REVOKE', 'EXECUTE', 'CALL', 'INFORMATION_SCHEMA',
]

const ALLOWED_TABLES = [
  'dim_customer', 'dim_loan', 'dim_product', 'dim_account',
  'dim_branch', 'dim_campaign', 'dim_employee', 'dim_date',
  'fact_loan_performance', 'fact_transactions', 'fact_account_balances',
  'fact_campaign_performance', 'fact_card_activity',
  'fact_customer_activity', 'fact_customer_engagement',
  'fact_marketing_spend',
]

const PROJECT = 'spacefin-analytics'
const DATASET = 'marts'
const TIMEOUT_MS = 15_000

export type SqlResult = {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
}

export async function runSql(sql: string): Promise<SqlResult> {
  const upper = sql.toUpperCase()

  for (const kw of BLOCKED_KEYWORDS) {
    if (upper.includes(kw)) {
      throw new Error(`Blocked keyword: ${kw}`)
    }
  }

  if (sql.includes(';')) {
    throw new Error('Multi-statement queries are not allowed')
  }

  const tableRefs = ALLOWED_TABLES.map(t => `${PROJECT}.${DATASET}.${t}`)
  const hasAllowedTable = tableRefs.some(t => sql.toLowerCase().includes(t.toLowerCase()))
  const hasShortRef = ALLOWED_TABLES.some(t => {
    const re = new RegExp(`\\b${t}\\b`, 'i')
    return re.test(sql)
  })
  if (!hasAllowedTable && !hasShortRef) {
    throw new Error('Query must reference at least one allowed table')
  }

  let finalSql = sql.trim()
  if (!/LIMIT\s+\d+/i.test(finalSql)) {
    finalSql = `${finalSql}\nLIMIT 5000`
  }

  const bq = getBigQuery()
  const queryResult = await Promise.race([
    bq.query({ query: finalSql, location: 'US' }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Query timed out after 15s')), TIMEOUT_MS)
    ),
  ]) as unknown as [Record<string, unknown>[]]

  const [rows] = queryResult

  const sanitized = rows.map(row => {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(row)) {
      if (v !== null && typeof v === 'object' && 'value' in v) {
        out[k] = Number((v as { value: string }).value)
      } else {
        out[k] = v
      }
    }
    return out
  })

  const columns = sanitized.length > 0 ? Object.keys(sanitized[0]) : []
  return { columns, rows: sanitized, rowCount: sanitized.length }
}
