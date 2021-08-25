import clsx from 'clsx'
import * as React from 'react'

type H2Type = React.HTMLAttributes<HTMLHeadingElement>

const H2: React.FunctionComponent<H2Type> = (props) => {
  return <h2 {...props} className={clsx(['text-[2.25rem]', props.className])} />
}

export { H2 }
