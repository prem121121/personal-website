import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Sign In — Space Financial AI Analyst' }

export default function SignInPage({ searchParams }: { searchParams: Record<string, string> }) {
  const callbackUrl = searchParams.callbackUrl ?? '/analytics/spacefin/chat'

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">Space Financial</p>
            <h1 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold text-white">AI Analyst</h1>
            <p className="text-sm text-slate-400 mt-2">Invite-only access</p>
          </div>

          <form
            action={async (formData: FormData) => {
              'use server'
              const username = formData.get('username') as string
              const password = formData.get('password') as string
              try {
                await signIn('credentials', { username, password, redirectTo: callbackUrl })
              } catch (err) {
                if (err instanceof AuthError) {
                  redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=invalid`)
                }
                throw err
              }
            }}
            className="space-y-4"
          >
            {searchParams.error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                Invalid username or password.
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Username</label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
