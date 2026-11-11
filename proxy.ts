import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isLocale, onlineLocales } from './lib/i18n'

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]

  if (isLocale(first)) {
    /* lingua spenta per questa release: si atterra sull'italiano
       (307, temporaneo: l'inglese tornerà) */
    if (!onlineLocales.includes(first)) {
      const url = request.nextUrl.clone()
      url.pathname = `/${defaultLocale}${pathname.slice(first.length + 1)}`
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|studio|_next|.*\\..*).*)'],
}
