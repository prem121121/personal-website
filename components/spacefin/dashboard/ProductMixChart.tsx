'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#a78bfa', '#f59e0b', '#ec4899']

interface ProductMixChartProps {
  data: { product_type: string; balance: number; account_count: number }[]
}

export default function ProductMixChart({ data }: ProductMixChartProps) {
  const total = data.reduce((s, d) => s + (d.balance ?? 0), 0)
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Balance by Product Type</p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="balance"
            nameKey="product_type"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            formatter={(value) => [`$${(Number(value) / 1_000_000).toFixed(1)}M (${((Number(value) / total) * 100).toFixed(1)}%)`]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => <span style={{ color: '#cbd5e1' }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
