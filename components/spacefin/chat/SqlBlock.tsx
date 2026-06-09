'use client'
import { useState } from 'react'

interface SqlBlockProps {
  sql: string
  status: 'running' | 'success' | 'error'
  rowCount?: number
}

const statusStyles = {
  running: 'bg-amber-500/20 text-amber-300',
  success: 'bg-emerald-500/20 text-emerald-300',
  error: 'bg-red-500/20 text-red-300',
}

const statusLabel = {
  running: 'Running...',
  success: 'Success',
  error: 'Error',
}

export default function SqlBlock({ sql, status, rowCount }: SqlBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 overflow-hidden text-xs my-2">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}>
          {statusLabel[status]}
        </span>
        <span className="text-slate-400 font-[family-name:var(--font-mono)]">SQL query</span>
        {rowCount !== undefined && status === 'success' && (
          <span className="ml-auto text-slate-500">{rowCount} rows</span>
        )}
        <span className="ml-auto text-slate-500">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <pre className="p-3 overflow-x-auto text-slate-300 font-[family-name:var(--font-mono)] border-t border-slate-700 leading-relaxed">
          {sql}
        </pre>
      )}
    </div>
  )
}
