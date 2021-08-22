import * as React from 'react'

import { MetaFunction, LinksFunction, LoaderFunction } from 'remix'
import { useRouteData } from 'remix'

import stylesUrl from '../styles/index.css'
import { withLocale } from '../utils/locale.server'
import { withUser } from '../utils/session.server'

type RouteData = {
  user: {
    firstName: string
    email: string
  }
  sessionDetails: {
    createdAt: Date
    expirationDate: Date
  }
  locales: string[]
}

export let meta: MetaFunction = () => {
  return {
    title: 'awesome app!',
    description: 'welcome to the awesome app!',
  }
}

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export let loader: LoaderFunction = async ({ request }) => {
  return withUser(request, (session, user) => {
    return withLocale(request, async (locales) => {
      const sessionDetails = await session.getSessionDetails()

      return {
        user,
        sessionDetails,
        locales,
      }
    })
  })
}

export default function Index() {
  const data = useRouteData<RouteData>()

  return (
    <div className='container'>
      <main>
        <section className='user-banner'>
          <div className='grid'>
            <span role='img' aria-label='hand waving' className='emoji'>
              👋
            </span>
            <h1>hi {data.user.firstName}</h1>
            <div className='row'>
              <span className='session-text'>
                session started at:{' '}
                {new Intl.DateTimeFormat(data.locales).format(
                  new Date(data.sessionDetails.createdAt).getTime()
                )}
              </span>
            </div>
            <div className='row'>
              <span className='session-text'>
                session valid till:{' '}
                {new Intl.DateTimeFormat(data.locales).format(
                  new Date(data.sessionDetails.expirationDate).getTime()
                )}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
