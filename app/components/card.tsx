import clsx from 'clsx'
import * as React from 'react'

type CardType = React.HTMLAttributes<HTMLDivElement>

const AuthCard: React.FunctionComponent<CardType> = (props) => {
  return (
    <section
      {...props}
      className={clsx([
        'w-[min(100%,24rem)] shadow-md p-8 rounded-2xl space-y-4',
        props.className,
      ])}
    />
  )
}

export { AuthCard }
