import Link from 'next/link'

const skills = [
  { category: 'Data Engineering', items: ['Python', 'BigQuery', 'dbt', 'Apache Spark'] },
  { category: 'AI & ML', items: ['Claude / Anthropic', 'LangGraph', 'Vanna', 'XGBoost'] },
  { category: 'Web & Backend', items: ['Next.js', 'TypeScript', 'Vercel AI SDK', 'REST APIs'] },
  { category: 'Infrastructure', items: ['GCP', 'Vercel', 'Docker', 'Git'] },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Data Engineer & AI Builder
          </div>
          <h1 className="font-[family-name:var(--font-bricolage)] text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6">
            Building analytics systems<br />
            <span className="text-emerald-400">that actually think</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            End-to-end data pipelines, AI-powered analytics, and interactive dashboards.
            Not just charts — systems that reason about your data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/analytics"
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              See the Work →
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Skills grid */}
      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8">
            Full-stack data skills
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {skills.map(({ category, items }) => (
              <div key={category} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
                  {category}
                </p>
                <ul className="space-y-1.5">
                  {items.map(item => (
                    <li key={item} className="text-sm text-slate-300">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured project */}
      <section className="relative px-6 pb-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
            Featured Project
          </p>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">Banking Analytics</span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">Live</span>
              </div>
              <h2 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold text-white mb-3">
                Space Financial
              </h2>
              <p className="text-slate-400 mb-4">
                A full banking analytics platform: 2.3M+ rows of synthetic data, 31 dbt models,
                a live BigQuery data warehouse, and an AI analyst powered by LangGraph + Claude.
              </p>
              <ul className="text-sm text-slate-400 space-y-1 mb-6">
                <li className="flex items-center gap-2"><span className="text-emerald-400">→</span> Interactive BI dashboard with deposit & delinquency trends</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">→</span> AI chat agent that writes SQL and renders charts on demand</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">→</span> Auth-gated for invite-only access to the AI features</li>
              </ul>
              <div className="flex gap-3">
                <Link
                  href="/analytics/spacefin/dashboard"
                  className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/analytics/spacefin"
                  className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              {[
                { label: 'Data Rows', value: '2.37M' },
                { label: 'dbt Models', value: '31' },
                { label: 'BigQuery Tables', value: '16' },
                { label: 'AI Agent Nodes', value: '7' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-center min-w-[100px]">
                  <p className="font-[family-name:var(--font-bricolage)] text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
