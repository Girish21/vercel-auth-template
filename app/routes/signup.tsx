import * as React from 'react'
import { ActionFunction, json, LoaderFunction, redirect } from 'remix'
import { useRouteData } from 'remix'
import { Form, MetaFunction } from 'remix'

import ErrorText from '../components/error'
import Input from '../components/input'
import SubmitButton from '../components/submit-button'
import { AuthContainer } from '../components/container'

import { getLoginSession } from '../utils/auth.server'
import { createUserIfNotExist } from '../utils/prisma.server'
import { authRoute, getUserSession } from '../utils/session.server'
import { validateSignup } from '../utils/validation.server'
import { AuthCard } from '../components/card'
import { H2 } from '../components/title'

type RouteData = {
  email?: string
  errors?: Record<string, string[]>
  message?: string
  name?: string
}

export const meta: MetaFunction = () => {
  return {
    title: 'signup',
    description: 'join this awesome app!',
  }
}

export const action: ActionFunction = async ({ request }) => {
  const loginSession = await getLoginSession(request)
  const body = new URLSearchParams(await request.text())

  const data = {
    email: body.get('email'),
    password: body.get('password'),
    name: body.get('name'),
  }

  const validation = await validateSignup(data)

  if (validation.type === 'error') {
    loginSession.flashName(data.name ?? '')
    loginSession.flashEmail(data.email ?? '')
    loginSession.flashErrors(validation.errors)

    return redirect('/signup', { headers: await loginSession.getHeaders() })
  }

  const { email, name, password } = validation.data

  try {
    const { id } = await createUserIfNotExist(email, password, name)
    const userSession = await getUserSession(request)
    await userSession.signIn(id)

    let headers = await userSession.getHeaders()
    headers = await loginSession.destroy(headers)

    return redirect('/', { headers })
  } catch (error) {
    loginSession.flashMessage(error.message)
    return redirect('/signup', { headers: await loginSession.getHeaders() })
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  return authRoute(request, async () => {
    const loginSession = await getLoginSession(request)

    return json(
      {
        email: loginSession.getEmail(),
        errors: loginSession.getErrors(),
        message: loginSession.getMessage(),
        name: loginSession.getName(),
      } as RouteData,
      {
        headers: await loginSession.getHeaders(),
      }
    )
  })
}

const Signup = () => {
  const data = useRouteData<RouteData>()

  return (
    <AuthContainer>
      <h1 className='sr-only'>join our awesome app!</h1>
      <AuthCard>
        <H2 className='text-center'>sign up</H2>
        <Form method='post' replace autoComplete='off' className='space-y-4'>
          <Input
            id='new-name'
            name='name'
            label='name'
            required
            defaultValue={data.name}
            errorText={data.errors?.['name']}
          />
          <Input
            id='new-email'
            name='email'
            label='email'
            required
            defaultValue={data.email}
            errorText={data.errors?.['email']}
          />
          <Input
            id='new-password'
            name='password'
            label='password'
            type='password'
            required
            errorText={data.errors?.['password']}
          />
          {data.message && <ErrorText>{data.message}</ErrorText>}
          <SubmitButton type='submit'>Submit</SubmitButton>
        </Form>
      </AuthCard>
    </AuthContainer>
  )
}

export default Signup
