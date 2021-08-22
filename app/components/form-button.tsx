import * as React from 'react'
import { useSubmit } from 'remix'

type FormButtonType = {
  method?: string
  action?: string
}

const FormButton: React.FunctionComponent<FormButtonType> = ({
  children,
  action,
  method,
}) => {
  return (
    <form method={method} action={action}>
      <button type='submit'>{children}</button>
    </form>
  )
}

export default FormButton
