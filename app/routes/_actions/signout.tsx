import * as React from 'react'
import { ActionFunction, LoaderFunction, redirect } from 'remix'
import { withUser } from '../../utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  return withUser(request, async (session) => {
    await session.signOut()

    return redirect('/login', { headers: await session.getHeaders() })
  })
}

export const loader: LoaderFunction = () => redirect('/')

const Signout = () => {
  return <h1>You should not see this page</h1>
}

export default Signout
