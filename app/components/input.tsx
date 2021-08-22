import * as React from 'react'

import stylesUrl from '../styles/input.css'
import ErrorText from './error'

type InputProp = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  errorText?: string[]
}

const Input = ({ label, id, errorText, ...rest }: InputProp) => {
  return (
    <div className='input-container'>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...rest} />
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </div>
  )
}
Input.stylesUrl = stylesUrl

export default Input
