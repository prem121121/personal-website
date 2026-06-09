'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DelinquencyChartProps {
  data: { month: string; overdue_30: number; overdue_60: number; overdue_90: number }[]
}

export default function DelinquencyChart({ data }: DelinquencyChartProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Delinquency Rate Trend (%)</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
          <YAxis tickFormatter={(v) => `${Number(v).toFixed(1)}%`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value) => [`${Number(value).toFixed(2)}%`]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="overdue_30" name="30-59 DPD" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="overdue_60" name="60-89 DPD" stroke="#f97316" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="overdue_90" name="90+ DPD" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
