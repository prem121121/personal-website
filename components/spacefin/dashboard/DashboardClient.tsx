'use client'
import { useState, useEffect, useCallback } from 'react'
import KpiCard from './KpiCard'
import BalanceTrendChart from './BalanceTrendChart'
import DelinquencyChart from './DelinquencyChart'
import ProductMixChart from './ProductMixChart'
import CampaignChart from './CampaignChart'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardData {
  kpis: { total_deposits: number; total_loans: number; active_accounts: number; delinquency_rate: number }
  balanceTrend: { month: string; deposits: number; savings: number; cd: number }[]
  delinquencyTrend: { month: string; overdue_30: number; overdue_60: number; overdue_90: number }[]
  productMix: { product_type: string; balance: number; account_count: number }[]
  campaignPerf: { campaign_name: string; roi: number; new_accounts: number }[]
}

const PERIODS = [{ value: '12', label: '12 Months' }, { value: '24', label: '24 Months' }, { value: '36', label: '36 Months' }, { value: 'all', label: 'All Time' }]
const REGIONS = [{ value: 'all', label: 'All Regions' }, { value: 'Northeast', label: 'Northeast' }, { value: 'Southeast', label: 'Southeast' }, { value: 'Midwest', label: 'Midwest' }, { value: 'Southwest', label: 'Southwest' }, { value: 'West', label: 'West' }]

function fmt$(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  return `$${Math.round(v).toLocaleString()}`
}

function PillSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('12')
  const [region, setRegion] = useState('all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ period, region })
    const res = await fetch(`/api/spacefin/dashboard?${params}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [period, region])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div className="bg-slate-950 min-h-screen pt-20 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Space Financial</p>
            <h1 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold text-white">Banking Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <PillSelect value={period} onChange={setPeriod} options={PERIODS} />
            <PillSelect value={region} onChange={setRegion} options={REGIONS} />
            {!loading && <span className="text-xs text-emerald-400 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />Live</span>}
          </div>
        </div>

        {/* KPIs */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[0,1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl bg-slate-800" />)}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Total Deposits" value={fmt$(data.kpis.total_deposits ?? 0)} accent="emerald" />
            <KpiCard label="Loan Portfolio" value={fmt$(data.kpis.total_loans ?? 0)} accent="blue" />
            <KpiCard label="Active Accounts" value={(data.kpis.active_accounts ?? 0).toLocaleString()} accent="amber" />
            <KpiCard label="Delinquency Rate" value={`${((data.kpis.delinquency_rate ?? 0)).toFixed(1)}%`} accent="red" sub="Loans past due" />
          </div>
        ) : null}

        {/* Charts row 1 */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-72 rounded-xl bg-slate-800" />
            <Skeleton className="h-72 rounded-xl bg-slate-800" />
          </div>
        ) : data ? (
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <BalanceTrendChart data={data.balanceTrend} />
            <DelinquencyChart data={data.delinquencyTrend} />
          </div>
        ) : null}

        {/* Charts row 2 */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-72 rounded-xl bg-slate-800" />
            <Skeleton className="h-72 rounded-xl bg-slate-800" />
          </div>
        ) : data ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <ProductMixChart data={data.productMix} />
            <CampaignChart data={data.campaignPerf} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
