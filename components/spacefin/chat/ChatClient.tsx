'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import SqlBlock from './SqlBlock'
import ChatChart from './ChatChart'
import type { UIMessage } from 'ai'

const SUGGESTED = [
  'What is the delinquency trend for 2023?',
  'Which product type has the highest balance?',
  'Show me the top 5 campaigns by deposits attracted',
  'Compare loan performance across risk grades',
]

function isLoading(status: string) {
  return status === 'submitted' || status === 'streaming'
}

export default function ChatClient({ userName }: { userName: string }) {
  const [input, setInput] = useState('')
  const [chatError, setChatError] = useState<string | null>(null)
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/spacefin/chat' }), [])
  const { messages, sendMessage, status } = useChat({ transport })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function safeSend(text: string) {
    setChatError(null)
    try {
      await sendMessage({ text })
    } catch (err) {
      console.error('[chat] sendMessage error:', err)
      setChatError(String(err))
    }
  }

  async function submit() {
    const text = input.trim()
    if (!text || isLoading(status)) return
    setInput('')
    await safeSend(text)
  }

  function renderMessage(msg: UIMessage) {
    if (msg.role === 'user') {
      const textPart = msg.parts?.find(p => p.type === 'text')
      const text = textPart && 'text' in textPart ? textPart.text : ''
      return (
        <div key={msg.id} className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-emerald-500/20 border border-emerald-500/30 px-4 py-2.5 text-sm text-white max-w-[80%]">
            {text}
          </div>
        </div>
      )
    }

    if (msg.role === 'assistant') {
      return (
        <div key={msg.id} className="flex justify-start">
          <div className="max-w-[95%] space-y-2">
            {(msg.parts ?? []).map((part, i) => {
              if (part.type === 'text') {
                return (
                  <div key={i} className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {part.text}
                  </div>
                )
              }

              if (part.type === 'tool-run_sql') {
                const input = part.input as { sql?: string } | undefined
                const sql = input?.sql ?? ''
                const isRunning = part.state === 'input-streaming' || part.state === 'input-available'
                const isError = part.state === 'output-error'
                const output = part.state === 'output-available' ? (part.output as { rowCount?: number }) : undefined
                return (
                  <SqlBlock
                    key={i}
                    sql={sql}
                    status={isRunning ? 'running' : isError ? 'error' : 'success'}
                    rowCount={output?.rowCount}
                  />
                )
              }

              if (part.type === 'tool-render_chart' && part.state === 'output-available') {
                const spec = part.input as Parameters<typeof ChatChart>[0]['spec']
                return <ChatChart key={i} spec={spec} />
              }

              return null
            })}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 pt-16">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs text-slate-500">Space Financial</p>
          <h1 className="font-[family-name:var(--font-bricolage)] text-base font-bold text-white">AI Analyst</h1>
        </div>
        <span className="text-xs text-slate-500">Signed in as <span className="text-slate-300">{userName}</span></span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="mx-auto max-w-xl mt-8">
            <p className="text-center text-slate-400 mb-6">Ask me anything about Space Financial data. I&apos;ll write the SQL and chart the results.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED.map(s => (
                <button
                  key={s}
                  onClick={() => safeSend(s)}
                  className="text-left rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map(renderMessage)}
        </div>

        {chatError && (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 break-words">
              Error: {chatError}
            </div>
          </div>
        )}

        {isLoading(status) && (
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-1.5 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-slate-800 bg-slate-950/80 backdrop-blur px-4 py-3">
        <div className="mx-auto max-w-3xl flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
            placeholder="Ask about deposits, loans, campaigns, delinquency..."
            className="flex-1 rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={submit}
            disabled={isLoading(status) || !input.trim()}
            className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
