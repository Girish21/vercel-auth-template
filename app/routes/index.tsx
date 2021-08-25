import * as React from 'react'

import type { MetaFunction, LoaderFunction } from 'remix'
import { useRouteData } from 'remix'
import { MainContainer } from '../components/container'

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

export let meta: MetaFunction = ({ data }) => {
  const name = data?.user?.firstName

  return {
    title: name ? `welcome ${name.toLowerCase()}` : 'awesome app!',
    description: 'welcome to the awesome app!',
  }
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
    <MainContainer>
      <main className='w-[var(--main-content-width)]'>
        <section className='p-8 rounded-2xl ring-4 ring-[color:var(--primary-border)] bg-[color:var(--primary-background)]'>
          <div className='grid grid-cols-[max-content,1fr] gap-4'>
            <span
              role='img'
              aria-label='hand waving'
              className='text-2xl self-center'
            >
              👋
            </span>
            <h1 className='text-3xl leading-8 lowercase'>
              hi {data.user.firstName}
            </h1>
            <div className='col-[2/-1]'>
              <span className='text-[color:var(--gray-600)] text-sm leading-6'>
                session started at:{' '}
                {new Intl.DateTimeFormat(data.locales).format(
                  new Date(data.sessionDetails.createdAt).getTime()
                )}
              </span>
            </div>
            <div className='col-[2/-1]'>
              <span className='text-[color:var(--gray-600)] text-sm leading-6'>
                session valid till:{' '}
                {new Intl.DateTimeFormat(data.locales).format(
                  new Date(data.sessionDetails.expirationDate).getTime()
                )}
              </span>
            </div>
          </div>
        </section>
      </main>
    </MainContainer>
  )
}
