import type { Request } from 'remix'
import { createCookieSessionStorage } from 'remix'
import { getFromEnv } from './misc.server'
import { isTheme, Theme } from './theme-provider'

const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    name: '__theme',
    secrets: [getFromEnv('COOKIE_SECRET')],
    sameSite: 'lax',
    path: '/',
    expires: new Date('2098-04-21'),
    httpOnly: true,
  },
})

const getThemeSession = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'))

  return {
    getTheme: () => {
      const theme = session.get('theme')
      return isTheme(theme) ? theme : null
    },
    setTheme: (theme: Theme) => {
      session.set('theme', theme)
    },
    commit: () => commitSession(session),
  }
}

export { getThemeSession }
