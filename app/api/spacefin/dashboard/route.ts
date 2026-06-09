import { NextRequest, NextResponse } from 'next/server'
import { runQuery } from '@/lib/bigquery'

const P = 'spacefin-analytics'
const D = 'marts'

function tbl(name: string) {
  return `\`${P}.${D}.${name}\``
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const period = searchParams.get('period') ?? '12'
  const region = searchParams.get('region') ?? 'all'
  const productType = searchParams.get('productType') ?? 'all'

  const monthFilter = period === 'all' ? '' : `AND b.year_month >= DATE_SUB(DATE_TRUNC(CURRENT_DATE(), MONTH), INTERVAL ${period} MONTH)`
  const regionFilter = region !== 'all' ? `AND c.region = '${region}'` : ''
  const productFilter = productType !== 'all' ? `AND b.product_type = '${productType}'` : ''

  const loanMonthFilter = period === 'all' ? '' : `AND lp.year_month >= DATE_SUB(DATE_TRUNC(CURRENT_DATE(), MONTH), INTERVAL ${period} MONTH)`
  const loanRegionFilter = region !== 'all' ? `AND dc.region = '${region}'` : ''

  const [kpis, balanceTrend, delinquencyTrend, productMix, campaignPerf] = await Promise.all([
    // KPI totals
    runQuery<{ total_deposits: number; total_loans: number; active_accounts: number; delinquency_rate: number }>(`
      WITH deposits AS (
        SELECT CAST(SUM(b.end_of_month_balance) AS FLOAT64) AS total_deposits
        FROM ${tbl('fact_account_balances')} b
        LEFT JOIN ${tbl('dim_customer')} c ON b.customer_id = c.customer_id AND c.is_current = true
        WHERE b.year_month = (SELECT MAX(year_month) FROM ${tbl('fact_account_balances')})
          AND b.is_active = true
          AND b.product_type IN ('Checking', 'Savings', 'CD')
          ${regionFilter}
      ),
      loans AS (
        SELECT CAST(SUM(lp.current_balance) AS FLOAT64) AS total_loans
        FROM ${tbl('fact_loan_performance')} lp
        LEFT JOIN ${tbl('dim_customer')} dc ON lp.customer_id = dc.customer_id AND dc.is_current = true
        WHERE lp.year_month = (SELECT MAX(year_month) FROM ${tbl('fact_loan_performance')})
          ${loanRegionFilter}
      ),
      accounts AS (
        SELECT COUNT(DISTINCT b.account_id) AS active_accounts
        FROM ${tbl('fact_account_balances')} b
        LEFT JOIN ${tbl('dim_customer')} c ON b.customer_id = c.customer_id AND c.is_current = true
        WHERE b.year_month = (SELECT MAX(year_month) FROM ${tbl('fact_account_balances')})
          AND b.is_active = true
          ${regionFilter}
      ),
      delinquency AS (
        SELECT
          CAST(COUNTIF(lp.days_past_due > 0) AS FLOAT64) / NULLIF(COUNT(*), 0) * 100 AS delinquency_rate
        FROM ${tbl('fact_loan_performance')} lp
        LEFT JOIN ${tbl('dim_customer')} dc ON lp.customer_id = dc.customer_id AND dc.is_current = true
        WHERE lp.year_month = (SELECT MAX(year_month) FROM ${tbl('fact_loan_performance')})
          ${loanRegionFilter}
      )
      SELECT
        COALESCE(d.total_deposits, 0) AS total_deposits,
        COALESCE(l.total_loans, 0) AS total_loans,
        COALESCE(a.active_accounts, 0) AS active_accounts,
        COALESCE(dq.delinquency_rate, 0) AS delinquency_rate
      FROM deposits d, loans l, accounts a, delinquency dq
    `),

    // Monthly deposit balance trend
    runQuery<{ month: string; deposits: number; savings: number; cd: number }>(`
      SELECT
        FORMAT_DATE('%Y-%m', b.year_month) AS month,
        CAST(COALESCE(SUM(CASE WHEN b.product_type = 'Checking' THEN b.end_of_month_balance END), 0) AS FLOAT64) AS deposits,
        CAST(COALESCE(SUM(CASE WHEN b.product_type = 'Savings' THEN b.end_of_month_balance END), 0) AS FLOAT64) AS savings,
        CAST(COALESCE(SUM(CASE WHEN b.product_type = 'CD' THEN b.end_of_month_balance END), 0) AS FLOAT64) AS cd
      FROM ${tbl('fact_account_balances')} b
      LEFT JOIN ${tbl('dim_customer')} c ON b.customer_id = c.customer_id AND c.is_current = true
      WHERE b.is_active = true
        ${monthFilter}
        ${regionFilter}
        ${productFilter}
      GROUP BY month
      ORDER BY month
    `),

    // Delinquency trend
    runQuery<{ month: string; current_pct: number; overdue_30: number; overdue_60: number; overdue_90: number }>(`
      SELECT
        FORMAT_DATE('%Y-%m', lp.year_month) AS month,
        CAST(COALESCE(COUNTIF(lp.delinquency_bucket = 'Current') * 100.0 / NULLIF(COUNT(*), 0), 0) AS FLOAT64) AS current_pct,
        CAST(COALESCE(COUNTIF(lp.delinquency_bucket = '30-59') * 100.0 / NULLIF(COUNT(*), 0), 0) AS FLOAT64) AS overdue_30,
        CAST(COALESCE(COUNTIF(lp.delinquency_bucket = '60-89') * 100.0 / NULLIF(COUNT(*), 0), 0) AS FLOAT64) AS overdue_60,
        CAST(COALESCE(COUNTIF(lp.delinquency_bucket = '90+') * 100.0 / NULLIF(COUNT(*), 0), 0) AS FLOAT64) AS overdue_90
      FROM ${tbl('fact_loan_performance')} lp
      LEFT JOIN ${tbl('dim_customer')} dc ON lp.customer_id = dc.customer_id AND dc.is_current = true
      WHERE 1=1
        ${loanMonthFilter}
        ${loanRegionFilter}
      GROUP BY month
      ORDER BY month
    `),

    // Product mix (account balances by product category)
    runQuery<{ product_type: string; balance: number; account_count: number }>(`
      SELECT
        b.product_type,
        CAST(COALESCE(SUM(b.end_of_month_balance), 0) AS FLOAT64) AS balance,
        COUNT(DISTINCT b.account_id) AS account_count
      FROM ${tbl('fact_account_balances')} b
      LEFT JOIN ${tbl('dim_customer')} c ON b.customer_id = c.customer_id AND c.is_current = true
      WHERE b.year_month = (SELECT MAX(year_month) FROM ${tbl('fact_account_balances')})
        AND b.is_active = true
        ${regionFilter}
      GROUP BY b.product_type
      ORDER BY balance DESC
    `),

    // Campaign performance (last 5 campaigns by total deposits attracted)
    runQuery<{ campaign_name: string; deposits: number; conversions: number; cpa: number }>(`
      SELECT
        dc.campaign_name,
        CAST(COALESCE(SUM(cp.total_deposits_attracted), 0) AS FLOAT64) AS deposits,
        COALESCE(SUM(cp.conversions), 0) AS conversions,
        CAST(COALESCE(AVG(cp.cost_per_acquisition), 0) AS FLOAT64) AS cpa
      FROM ${tbl('fact_campaign_performance')} cp
      JOIN ${tbl('dim_campaign')} dc ON cp.campaign_id = dc.campaign_id
      GROUP BY dc.campaign_name
      ORDER BY deposits DESC
      LIMIT 8
    `),
  ])

  return NextResponse.json(
    { kpis: kpis[0], balanceTrend, delinquencyTrend, productMix, campaignPerf },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
