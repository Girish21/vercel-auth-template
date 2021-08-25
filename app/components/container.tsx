import clsx from 'clsx'
import * as React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement>

const commonClassName =
  'mt-[-76px] flex-1 flex flex-col justify-center items-center'

const AuthContainer: React.FunctionComponent<Props> = (props) => {
  return (
    <main {...props} className={clsx([commonClassName, props.className])} />
  )
}

const MainContainer: React.FunctionComponent<Props> = (props) => {
  return <div {...props} className={clsx([commonClassName, props.className])} />
}

export { AuthContainer, MainContainer }
