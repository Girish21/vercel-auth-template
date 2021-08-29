import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { LinksFunction, LoaderFunction, useRouteData } from 'remix'
import { Links, LiveReload, Meta, Scripts } from 'remix'
import appUrl from './styles/app.css'
import stylesUrl from './styles/global.css'

import Nav from './components/nav'
import { getUserSession } from './utils/session.server'
import {
  SSRTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from './utils/theme-provider'
import { getThemeSession } from './utils/theme.server'

type RouteData = {
  isLoggedin: boolean
  theme: Theme
}

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: appUrl },
    { rel: 'stylesheet', href: stylesUrl },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await getUserSession(request)
  const themeSession = await getThemeSession(request)

  const user = await userSession.getUser()
  const isLoggedin = !!user

  return { isLoggedin, theme: themeSession.getTheme() }
}

function App({ isLoggedin }: { isLoggedin: boolean }) {
  const [theme] = useTheme()

  return (
    <html lang='en' className={theme ?? ''} suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.png' type='image/png' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <Meta />
        <Links />
        <SSRTheme ssrTheme={theme} />
      </head>
      <body className='dark:bg-[color:var(--gray-900)] bg-white transition-colors'>
        <Nav isLoggedin={isLoggedin} />
        <Outlet />

        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default function AppWithProvider() {
  const data = useRouteData<RouteData>()

  return (
    <ThemeProvider ssrTheme={data.theme}>
      <App isLoggedin={data.isLoggedin} />
    </ThemeProvider>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang='en'>
      <head>
        <title>Oh no...</title>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.png' type='image/png' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <Meta />
      </head>
      <body>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
        <p>
          Replace this UI with what you want users to see when your app throws
          uncaught errors.
        </p>
      </body>
    </html>
  )
}
