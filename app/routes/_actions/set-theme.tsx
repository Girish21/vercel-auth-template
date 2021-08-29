import * as React from 'react'
import type { ActionFunction } from 'remix'
import { redirect } from 'remix'
import { isTheme } from '../../utils/theme-provider'
import { getThemeSession } from '../../utils/theme.server'

export const action: ActionFunction = async ({ request }) => {
  const redirectURL = new URL(request.url).pathname
  const data = await request.json()

  if (!(data || data.theme)) {
    return redirect(redirectURL)
  }

  if (!isTheme(data.theme)) {
    return redirect(redirectURL)
  }

  const themeSession = await getThemeSession(request)
  themeSession.setTheme(data.theme)

  return redirect(redirectURL, {
    headers: { 'Set-Cookie': await themeSession.commit() },
  })
}

const SetTheme = () => <h1>Uh oh! You should not see this page...</h1>

export default SetTheme
