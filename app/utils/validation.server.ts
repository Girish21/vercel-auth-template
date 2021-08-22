import * as yup from 'yup'

type LoginData = {
  email: string | null
  password: string | null
}

type SignupData = LoginData & { name: string | null }

type Errors = {
  type: 'error'
  errors: Record<string, string[]>
}

type LoginValidationReturn =
  | Errors
  | { type: 'success'; data: { email: string; password: string } }

type SignupValidationReturn =
  | Errors
  | { type: 'success'; data: { email: string; password: string; name: string } }

const emailValidation = yup
  .string()
  .required('email is required')
  .email('enter a valid email')

const passwordValidation = yup
  .string()
  .required('password is required')
  .min(6, 'password must be minimum of 6 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'does not match the password policy',
    }
  )

const nameValidation = yup.string().required('name is required')

const loginSchema = yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
})

const validationHelper = async (
  key: string,
  validation: Promise<string>,
  errors: Record<string, string[]>
) => {
  return (await validation.catch((e: yup.ValidationError) => {
    errors[key] = e.errors
  })) as string
}

const validateLogin = async (
  data: LoginData
): Promise<LoginValidationReturn> => {
  const errors: Record<string, string[]> = {}

  const [email, password] = await Promise.all([
    validationHelper('email', emailValidation.validate(data.email), errors),
    validationHelper(
      'password',
      passwordValidation.validate(data.password),
      errors
    ),
  ])

  if (Object.keys(errors).length > 0) {
    return {
      type: 'error',
      errors,
    }
  }

  return {
    type: 'success',
    data: { email, password },
  }
}

const validateSignup = async (
  data: SignupData
): Promise<SignupValidationReturn> => {
  const errors: Record<string, string[]> = {}

  const [email, password, name] = await Promise.all([
    validationHelper('email', emailValidation.validate(data.email), errors),
    validationHelper(
      'password',
      passwordValidation.validate(data.password),
      errors
    ),
    validationHelper('name', nameValidation.validate(data.name), errors),
  ])

  if (Object.keys(errors).length > 0) {
    return { type: 'error', errors }
  }

  return {
    type: 'success',
    data: { email, name, password },
  }
}

export {
  emailValidation,
  loginSchema,
  nameValidation,
  passwordValidation,
  validateLogin,
  validateSignup,
}
