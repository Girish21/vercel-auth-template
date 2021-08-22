import type { User } from '@prisma/client'
import {
  HeadersInit,
  ResponseInit,
  Request,
  LoaderFunction,
  Session,
  redirect,
} from 'remix'
import { createCookieSessionStorage, Headers } from 'remix'
import { getFromEnv } from './misc.server'
import {
  createSession,
  deleteSession,
  getSessionDetails,
  getUserFromSessionId,
} from './prisma.server'

const sessionExpirationTime = 1000 * 60 * 60 * 24 * 30
const sessionIdKey = '__session_id__'

type SharableUserType = Pick<User, 'email' | 'firstName' | 'id'>
type SessionType = {
  commit: () => Promise<string | null>
  getSessionId: () => string | undefined
  session: Session
  unsetSessionId: () => void
  getHeaders: (
    headers?: ResponseInit['headers'] | undefined
  ) => Promise<HeadersInit>
  getSessionDetails: () => Promise<{
    createdAt: Date
    expirationDate: Date
  } | null>
  getUser: () => Promise<{
    user: SharableUserType
  } | null>
  signIn: (id: string) => Promise<void>
  signOut: () => Promise<void>
}

const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secrets: [getFromEnv('COOKIE_SECRET')],
    secure: true,
    maxAge: sessionExpirationTime,
  },
})

const getUserSession = async (request: Request): Promise<SessionType> => {
  const session = await getSession(request.headers.get('Cookie'))
  const initialValues = await commitSession(session)

  const getSessionId = (): string | undefined => session.get(sessionIdKey)
  const unsetSessionId = () => session.unset(sessionIdKey)

  const commit = async () => {
    const value = await commitSession(session)
    return value === initialValues ? null : value
  }

  return {
    commit,
    getSessionId,
    session,
    unsetSessionId,
    getHeaders: async (headers: ResponseInit['headers'] = new Headers()) => {
      const value = await commit()

      if (!value) return headers
      if (headers instanceof Headers) {
        headers.append('Set-Cookie', value)
      } else if (Array.isArray(headers)) {
        headers.push(['Set-Cookie', value])
      } else {
        headers['Set-Cookie'] = value
      }

      return headers
    },
    getSessionDetails: async () => {
      const sessionId = getSessionId()
      if (!sessionId) return null

      return getSessionDetails(sessionId)
    },
    getUser: async (): Promise<{
      user: SharableUserType
    } | null> => {
      const id = getSessionId()
      if (!id) return null

      return getUserFromSessionId(id).catch((error) => {
        unsetSessionId()
        console.error('failed to fetch user from session id', error)
        return null
      })
    },
    signIn: async (id: string) => {
      try {
        const userSession = await createSession(id)
        session.set(sessionIdKey, userSession.id)
      } catch (error) {
        console.error('cannot create session', error)
      }
    },
    signOut: async () => {
      const sessionId = getSessionId()
      if (sessionId) {
        unsetSessionId()
        try {
          await deleteSession(sessionId)
        } catch (error) {
          console.error('Unable to delete session', error)
        }
      }
    },
  }
}

const withUser = async (
  request: Request,
  next: (
    session: SessionType,
    user: SharableUserType
  ) => ReturnType<LoaderFunction>
): Promise<ReturnType<LoaderFunction>> => {
  const session = await getUserSession(request)
  const user = await session.getUser()

  if (!user) {
    session.unsetSessionId()
    return redirect('/login', { headers: await session.getHeaders() })
  }

  return next(session, user.user)
}

const authRoute = async (
  request: Request,
  next: () => ReturnType<LoaderFunction>
): Promise<ReturnType<LoaderFunction>> => {
  const userSession = await getUserSession(request)

  const session = userSession.getSessionId()

  if (session) {
    return redirect('/')
  }

  return next()
}

export { authRoute, getUserSession, sessionExpirationTime, withUser }
