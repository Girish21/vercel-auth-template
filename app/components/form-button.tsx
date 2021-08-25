import * as React from 'react'
import NavLink from './nav-link'

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
      <NavLink renderType='button' type='submit'>
        {children}
      </NavLink>
    </form>
  )
}

export default FormButton
