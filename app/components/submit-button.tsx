import clsx from 'clsx'
import * as React from 'react'

type SubmitButtonType = React.ButtonHTMLAttributes<HTMLButtonElement>

const SubmitButton: React.FunctionComponent<SubmitButtonType> = (props) => {
  return (
    <button
      {...props}
      className={clsx([
        'text-[color:var(--text-contrast)] py-[0.8rem] px-4 rounded-[8px] bg-button-gradient bg-left bg-gradient-to-r from-[color:var(--primary-gradient-start)] to-[color:var(--primary-gradient-end)] text-[1.15rem]',
        props.className,
      ])}
    />
  )
}

export default SubmitButton
