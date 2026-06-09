'use client'
import { useEffect } from 'react'

export default function ChatError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[chat error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">Error</p>
        <h2 className="font-bold text-white text-lg mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-400 mb-1 break-words">{error.message}</p>
        {error.digest && <p className="text-xs text-slate-600 mb-4">digest: {error.digest}</p>}
        <button
          onClick={reset}
          className="mt-4 rounded-full bg-emerald-500 px-6 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
