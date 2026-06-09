import Link from 'next/link'

const stack = [
  { layer: 'Data Generation', tools: 'Python + Faker', detail: '2.37M rows across 15 raw tables, 3 years of history' },
  { layer: 'Data Warehouse', tools: 'Google BigQuery', detail: 'raw → staging → marts with 16 mart tables' },
  { layer: 'Transformations', tools: 'dbt Cloud', detail: '15 staging views + 16 mart models, SCD2 customers' },
  { layer: 'AI Analyst', tools: 'LangGraph + Claude', detail: '7-node agent: intent → SQL → validate → execute → chart → narrative' },
  { layer: 'BI Dashboard', tools: 'Next.js + Recharts', detail: 'Live BigQuery queries, filterable charts, no caching delay' },
  { layer: 'Auth Gate', tools: 'NextAuth v5 + bcrypt', detail: 'Invite-only credentials, signed JWT sessions' },
]

export default function SpaceFinPage() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2">
          <Link href="/analytics" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Analytics
          </Link>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">Banking Analytics</span>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Live on BigQuery
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-bricolage)] text-4xl font-extrabold text-white mb-4">
          Space Financial
        </h1>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl">
          A regional bank analytics platform built end-to-end: synthetic data generation,
          a BigQuery data warehouse modeled with dbt, an interactive BI dashboard,
          and an AI analyst that writes SQL and renders charts on demand.
        </p>

        <div className="flex gap-3 mb-12">
          <Link
            href="/analytics/spacefin/dashboard"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Live Dashboard →
          </Link>
          <Link
            href="/analytics/spacefin/chat"
            className="rounded-full border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 transition-colors"
          >
            AI Analyst (invite only)
          </Link>
          <a
            href="https://github.com/prem121121/spacefin-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: '2.37M', label: 'Data Rows' },
            { value: '31', label: 'dbt Models' },
            { value: '16', label: 'Mart Tables' },
            { value: '7', label: 'AI Agent Nodes' },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
              <p className="font-[family-name:var(--font-bricolage)] text-3xl font-extrabold text-white">{value}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <h2 className="font-[family-name:var(--font-bricolage)] text-xl font-bold text-white mb-4">Architecture</h2>
        <div className="space-y-3 mb-12">
          {stack.map(({ layer, tools, detail }) => (
            <div key={layer} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="min-w-[160px]">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{layer}</span>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-white font-[family-name:var(--font-mono)] min-w-[180px]">{tools}</span>
                <span className="text-sm text-slate-400">{detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Key engineering decisions */}
        <h2 className="font-[family-name:var(--font-bricolage)] text-xl font-bold text-white mb-4">Key Engineering Decisions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'SCD2 for customer history', body: 'dim_customer tracks changes over time with valid_from/valid_to and is_current. Queries use is_current=true for current state, preserving full audit trail.' },
            { title: 'Safety layer on AI SQL', body: 'Every query from Claude passes keyword blocking (no INSERT/DELETE/DROP), table allowlisting, and a 15-second timeout before hitting BigQuery. The AI cannot mutate data.' },
            { title: 'Native BigQuery surrogate keys', body: 'Surrogate keys use to_hex(md5(...)) natively in BigQuery — no dbt_utils dependency required, avoiding package import errors.' },
            { title: 'CAST AS FLOAT64 for NUMERICs', body: 'BigQuery NUMERIC type serializes as strings in JSON. All aggregations cast to FLOAT64 to ensure correct numeric parsing in the Next.js API layer.' },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
