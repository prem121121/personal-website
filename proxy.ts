import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedPage = pathname.startsWith('/analytics/spacefin/chat')
  const isProtectedApi = pathname.startsWith('/api/spacefin/chat')

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next()

  const session = await auth()

  if (!session) {
    if (isProtectedApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/analytics/spacefin/chat/:path*', '/api/spacefin/chat/:path*'],
}
