'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface CampaignChartProps {
  data: { campaign_name: string; deposits: number; conversions: number }[]
}

export default function CampaignChart({ data }: CampaignChartProps) {
  const sorted = [...data].sort((a, b) => (b.deposits ?? 0) - (a.deposits ?? 0))
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Campaign Performance — Deposits Attracted</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `$${(Number(v) / 1_000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="campaign_name" width={140} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            formatter={(value) => [`$${(Number(value) / 1_000).toFixed(1)}K`]}
          />
          <Bar dataKey="deposits" radius={[0, 4, 4, 0]}>
            {sorted.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#10b981' : '#334155'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
