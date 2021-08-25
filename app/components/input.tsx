import clsx from 'clsx'
import * as React from 'react'

import ErrorText from './error'

type InputProp = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  errorText?: string[]
}

const Input = ({ label, id, errorText, ...rest }: InputProp) => {
  return (
    <div className='input-container'>
      <label
        className='text-[color:var(--gray-700)] font-bold text-[1.025rem] inline-block pt-1 px-1 pb-2'
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className={clsx([
          'border-0 block w-full bg-[color:var(--secondary-light)] rounded-lg text-[color:var(--gray-900)] text-[length:1.15rem] leading-6 px-2 py-3',
          rest.className,
        ])}
      />
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </div>
  )
}

export default Input
