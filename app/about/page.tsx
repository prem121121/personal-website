import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">About</p>
        <h1 className="font-[family-name:var(--font-bricolage)] text-4xl font-extrabold text-white mb-6">
          Premesh Devasani
        </h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          I&apos;m a data engineer and AI systems builder focused on the intersection of
          reliable data pipelines, modern LLMs, and real-world analytics. I build things
          end-to-end — from raw data generation to production-ready dashboards and AI agents.
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-8">
          <h2 className="font-semibold text-white mb-4">What I&apos;m focused on</h2>
          <ul className="space-y-3 text-slate-400">
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0">→</span>
              <span>Building analytics infrastructure that scales — BigQuery, dbt, and Python pipelines that don&apos;t need constant babysitting</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0">→</span>
              <span>AI-augmented analytics — using LangGraph and Claude to turn natural language questions into precise SQL answers with charts</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 shrink-0">→</span>
              <span>Shipping production-quality work — not notebooks or prototypes, but deployed systems with auth, error handling, and real data</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-3">Data Stack</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>Google BigQuery</li>
              <li>dbt Core / Cloud</li>
              <li>Python (Pandas, Faker, SQLAlchemy)</li>
              <li>Apache Spark (PySpark)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-3">AI & Apps</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>Claude (Anthropic API)</li>
              <li>LangGraph, Vanna</li>
              <li>Next.js + TypeScript</li>
              <li>Vercel AI SDK v6</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/analytics"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            See the Projects →
          </Link>
          <a
            href="https://github.com/prem121121"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
