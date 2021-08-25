import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { LinksFunction, LoaderFunction, useRouteData } from 'remix'
import { Links, LiveReload, Meta, Scripts } from 'remix'
import appUrl from './styles/app.css'
import stylesUrl from './styles/global.css'

import Nav from './components/nav'
import { getUserSession } from './utils/session.server'

type RouteData = {
  isLoggedin: boolean
}

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: appUrl },
    { rel: 'stylesheet', href: stylesUrl },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await getUserSession(request)

  const user = await userSession.getUser()
  const isLoggedin = !!user

  return { isLoggedin }
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.png' type='image/png' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default function App() {
  const data = useRouteData<RouteData>()

  return (
    <Document>
      <Nav isLoggedin={data.isLoggedin} />
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  )
}
