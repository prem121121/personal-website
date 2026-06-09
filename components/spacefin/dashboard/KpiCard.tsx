interface KpiCardProps {
  label: string
  value: string
  sub?: string
  accent?: 'emerald' | 'blue' | 'amber' | 'red'
}

const accents = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

export default function KpiCard({ label, value, sub, accent = 'emerald' }: KpiCardProps) {
  return (
    <div className="relative rounded-xl border border-slate-700 bg-slate-900 p-5 overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accents[accent]} rounded-l-xl`} />
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
      <p className="font-[family-name:var(--font-bricolage)] text-3xl font-bold text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}
