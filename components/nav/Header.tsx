'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const links = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/analytics', label: 'ANALYTICS' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(90vw,860px)]">
      <nav className="flex items-center justify-between gap-4 rounded-full border border-slate-700/60 bg-slate-900/80 px-5 py-2.5 backdrop-blur-md shadow-lg shadow-black/30">
        <Link href="/" className="font-[family-name:var(--font-bricolage)] text-sm font-bold tracking-tight text-white">
          PD
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest transition-colors',
                pathname === href || (href !== '/' && pathname.startsWith(href))
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link
          href="/analytics"
          className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold tracking-wide text-slate-950 hover:bg-emerald-400 transition-colors"
        >
          View Work
        </Link>
      </nav>
    </header>
  )
}
