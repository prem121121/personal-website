import { streamText, tool, stepCountIs, convertToModelMessages } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { runSql } from '@/lib/tools/runSql'
import { SPACEFIN_SYSTEM_PROMPT } from '@/lib/domains/spacefin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const { messages } = await req.json()
  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SPACEFIN_SYSTEM_PROMPT,
    messages: modelMessages,
    stopWhen: stepCountIs(6),
    tools: {
      run_sql: tool({
        description: 'Execute a read-only SQL query against the Space Financial BigQuery data warehouse and return the results.',
        inputSchema: z.object({
          sql: z.string().describe('The SQL query to execute. Must use fully-qualified table names: spacefin-analytics.marts.<table>'),
          reasoning: z.string().describe('Brief explanation of what this query will answer'),
        }),
        execute: async (input) => {
          try {
            const result = await runSql(input.sql)
            return { success: true, ...result }
          } catch (err) {
            return { success: false, error: String(err), columns: [], rows: [], rowCount: 0 }
          }
        },
      }),
      render_chart: tool({
        description: 'Render a chart in the browser with the provided data and configuration.',
        inputSchema: z.object({
          type: z.enum(['bar', 'line', 'area', 'pie', 'donut', 'horizontal_bar']).describe('Chart type'),
          title: z.string().describe('Chart title'),
          data: z.array(z.record(z.string(), z.unknown())).describe('Array of data objects'),
          xKey: z.string().optional().describe('Key for X axis'),
          yKeys: z.array(z.string()).optional().describe('Keys for Y axis values'),
          nameKey: z.string().optional().describe('Key for labels (pie/donut)'),
          valueKey: z.string().optional().describe('Key for values (pie/donut)'),
        }),
        execute: async (input) => {
          return { rendered: true, type: input.type, title: input.title, row_count: input.data.length }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
