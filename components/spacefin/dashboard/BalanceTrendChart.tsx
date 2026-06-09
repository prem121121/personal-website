'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BalanceTrendChartProps {
  data: { month: string; deposits: number; savings: number; cd: number }[]
}

function fmtM(v: number) {
  return `$${(v / 1_000_000).toFixed(1)}M`
}

export default function BalanceTrendChart({ data }: BalanceTrendChartProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Deposit Balance Trend</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gDeposits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
          <YAxis tickFormatter={(v) => `$${(Number(v) / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value) => [fmtM(Number(value))]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="deposits" name="Checking" stroke="#10b981" fill="url(#gDeposits)" strokeWidth={2} />
          <Area type="monotone" dataKey="savings" name="Savings" stroke="#3b82f6" fill="url(#gSavings)" strokeWidth={2} />
          <Area type="monotone" dataKey="cd" name="CD" stroke="#a78bfa" fill="none" strokeWidth={2} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
