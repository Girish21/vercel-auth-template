import {
  MetaFunction,
  ActionFunction,
  redirect,
  LoaderFunction,
  json,
  useRouteData,
} from 'remix'
import { Form } from 'remix'
import * as React from 'react'

import Input from '../components/input'

import { validateLogin } from '../utils/validation.server'
import { getLoginSession } from '../utils/auth.server'

import { getUserFromEmail } from '../utils/prisma.server'
import { compareHash } from '../utils/bcrypt.server'
import { authRoute, getUserSession } from '../utils/session.server'
import ErrorText from '../components/error'
import SubmitButton from '../components/submit-button'
import { AuthContainer } from '../components/container'
import { AuthCard } from '../components/card'
import { H2 } from '../components/title'

type RouteData = {
  email?: string
  errors?: Record<string, string[]>
  message?: string
}

export const meta: MetaFunction = () => {
  return { title: 'login', describe: 'Login into the awesome app!' }
}

export const action: ActionFunction = async ({ request }) => {
  const loginSession = await getLoginSession(request)
  const body = new URLSearchParams(await request.text())

  const data = {
    email: body.get('email'),
    password: body.get('password'),
  }

  const validationResponse = await validateLogin(data)

  if (validationResponse.type === 'error') {
    loginSession.flashEmail(data.email ?? '')
    loginSession.flashErrors(validationResponse.errors)

    return redirect('/login', { headers: await loginSession.getHeaders() })
  }
  const { email: userEmail, password: userPassword } = validationResponse.data
  const fromDb = await getUserFromEmail(userEmail)

  if (!fromDb) {
    loginSession.flashMessage('email/password is wrong')
    return redirect('/login', { headers: await loginSession.getHeaders() })
  }

  const { id, password } = fromDb
  const isSame = await compareHash(userPassword, password)

  if (!isSame) {
    loginSession.flashMessage('email/password is wrong')
    return redirect('/login', { headers: await loginSession.getHeaders() })
  }

  const userSession = await getUserSession(request)

  await userSession.signIn(id)
  let headers = await userSession.getHeaders()
  headers = await loginSession.destroy(headers)

  return redirect('/', {
    headers,
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  return authRoute(request, async () => {
    const loginSession = await getLoginSession(request)

    return json(
      {
        message: loginSession.getMessage(),
        errors: loginSession.getErrors(),
        email: loginSession.getEmail(),
      },
      { headers: await loginSession.getHeaders() }
    )
  })
}

const Login = () => {
  const data = useRouteData<RouteData>()

  return (
    <AuthContainer>
      <h1 className='sr-only'>login of awesome app!</h1>
      <AuthCard>
        <H2 className='text-center'>login</H2>
        <Form method='post' replace autoComplete='off' className='space-y-4'>
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
          <SubmitButton type='submit'>submit</SubmitButton>
        </Form>
      </AuthCard>
    </AuthContainer>
  )
}

export default Login
