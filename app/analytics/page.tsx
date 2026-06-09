import Link from 'next/link'

const projects = [
  {
    slug: 'spacefin',
    name: 'Space Financial',
    tag: 'Banking Analytics',
    status: 'live' as const,
    description: 'A regional bank analytics platform with 2.37M rows of synthetic data, 31 dbt models, a live BigQuery warehouse, and an AI analyst built on LangGraph + Claude.',
    tags: ['BigQuery', 'dbt', 'LangGraph', 'Claude', 'Python'],
    metrics: [{ label: 'Rows', value: '2.37M' }, { label: 'dbt Models', value: '31' }],
  },
  {
    slug: null,
    name: 'EverMart Retail',
    tag: 'Retail Analytics',
    status: 'soon' as const,
    description: 'Retail analytics for a fictional sportswear company. 50 stores, 1M+ orders, Spark ingestion, dbt marts, AI-driven basket analysis.',
    tags: ['BigQuery', 'dbt', 'PySpark', 'Claude'],
    metrics: [],
  },
]

export default function AnalyticsPage() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Analytics Portfolio</p>
        <h1 className="font-[family-name:var(--font-bricolage)] text-4xl font-extrabold text-white mb-4">
          End-to-end data systems
        </h1>
        <p className="text-slate-400 mb-12 max-w-2xl">
          Each project is a complete data platform: raw data → ingestion → transformation → BI dashboard → AI analyst.
          Built to showcase real engineering decisions, not tutorials.
        </p>

        <div className="grid gap-6">
          {projects.map(({ slug, name, tag, status, description, tags, metrics }) => (
            <div key={name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">{tag}</span>
                    {status === 'live' ? (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        Live
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-slate-400">Coming Soon</span>
                    )}
                  </div>
                  <h2 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold text-white">{name}</h2>
                </div>
                {metrics.length > 0 && (
                  <div className="flex gap-3 shrink-0">
                    {metrics.map(({ label, value }) => (
                      <div key={label} className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-center">
                        <p className="font-[family-name:var(--font-bricolage)] text-xl font-bold text-white">{value}</p>
                        <p className="text-xs text-slate-400">{label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-slate-400 mb-4">{description}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {tags.map(t => (
                  <span key={t} className="rounded-md border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-xs text-slate-300 font-[family-name:var(--font-mono)]">{t}</span>
                ))}
              </div>

              {slug ? (
                <div className="flex gap-3">
                  <Link
                    href={`/analytics/${slug}/dashboard`}
                    className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    Live Dashboard →
                  </Link>
                  <Link
                    href={`/analytics/${slug}/chat`}
                    className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 transition-colors"
                  >
                    AI Analyst (gated)
                  </Link>
                  <Link
                    href={`/analytics/${slug}`}
                    className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">In development — check back soon.</p>
              )}
            </div>
          ))}
        </div>

        {/* How it&apos;s built */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="font-[family-name:var(--font-bricolage)] text-xl font-bold text-white mb-4">How it&apos;s built</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-400">
            <div>
              <p className="text-white font-medium mb-2">Data Layer</p>
              <p>Python generators create synthetic data. BigQuery hosts the raw, staging, and mart layers. dbt handles all transformations with full tests.</p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Dashboard Layer</p>
              <p>Next.js API routes query BigQuery server-side. Recharts renders the data. Filters hit the API with params — no frontend state except UI.</p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">AI Layer</p>
              <p>Claude writes SQL via tool use. A safety layer validates every query before execution. Results stream back to the browser and render as charts inline.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
