import clsx from 'clsx'
import * as React from 'react'

type ErrorTextType = React.HTMLAttributes<HTMLDivElement>

const ErrorText: React.FunctionComponent<ErrorTextType> = (props) => {
  return (
    <span
      {...props}
      className={clsx([
        'text-[color:var(--danger)] block text-[0.825rem] font-bold py-2',
        props.className,
      ])}
    />
  )
}

export default ErrorText
