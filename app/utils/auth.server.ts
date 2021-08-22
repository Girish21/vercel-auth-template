import type { HeadersInit, Request, ResponseInit } from 'remix'
import { createCookieSessionStorage, Headers } from 'remix'
import { getFromEnv } from './misc.server'

const maxAge = 1000 * 60 * 60

const mergeHeaders = (headers: HeadersInit, value: string | null) => {
  if (!value) return headers
  if (headers instanceof Headers) {
    headers.append('Set-Cookie', value)
  } else if (Array.isArray(headers)) {
    headers.push(['Set-Cookie', value])
  } else {
    headers['Set-Cookie'] = value
  }

  return headers
}

const { commitSession, destroySession, getSession } =
  createCookieSessionStorage({
    cookie: {
      name: '__login',
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'lax',
      secrets: [getFromEnv('LOGIN_COOKIE_SECRET')],
    },
  })

const getLoginSession = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'))
  const initialValues = await commitSession(session)

  const commit = async () => {
    const value = await commitSession(session)
    return value === initialValues ? null : value
  }

  return {
    session,
    commit,
    flashMessage: (message: string) => session.flash('message', message),
    getMessage: () => session.get('message'),
    flashErrors: (errors: Record<string, string[]>) =>
      session.flash('errors', errors),
    getErrors: () => session.get('errors'),
    flashEmail: (email: string) => session.flash('email', email),
    setEmail: (email: string) => session.set('email', email),
    getEmail: () => session.get('email'),
    flashName: (name: string) => session.flash('name', name),
    setName: (name: string) => session.set('name', name),
    getName: () => session.get('name'),
    clean: () => {
      session.unset('message')
      session.unset('errors')
      session.unset('email')
      session.unset('name')
    },
    destroy: async (headers: ResponseInit['headers'] = new Headers()) => {
      const value = await destroySession(session)

      return mergeHeaders(headers, value)
    },
    getHeaders: async (headers: ResponseInit['headers'] = new Headers()) => {
      const value = await commit()

      return mergeHeaders(headers, value)
    },
  }
}

export { getLoginSession }
