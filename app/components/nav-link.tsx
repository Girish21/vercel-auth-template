import clsx from 'clsx'
import * as React from 'react'
import {
  NavLink as NavLinkImpl,
  NavLinkProps,
  Link,
  LinkProps,
} from 'react-router-dom'

type Button = {
  renderType: 'button'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

type NavAnchor = {
  renderType: 'nav-link'
} & NavLinkProps

type Anchor = {
  renderType: 'link'
} & LinkProps

type NavLinkType = Anchor | Button | NavAnchor

const isButton = (props: NavLinkType): props is Button => {
  return props.renderType === 'button'
}

const isNavLink = (props: NavLinkType): props is NavAnchor => {
  return props.renderType === 'nav-link'
}

const commonClassName =
  'pb-1 text-[color:var(--text)] bg-gradient-to-r from-[color:var(--text)] to-[color:var(--text)] bg-no-repeat bg-nav-link bg-left-bottom transition-background duration-300 text-base hover:bg-nav-link-hover'

const activeClassName = 'bg-nav-link-hover'

const NavLink = (props: NavLinkType) => {
  if (isButton(props)) {
    const { renderType: _, ...rest } = props
    return (
      <button {...rest} className={clsx([commonClassName, props.className])} />
    )
  }

  if (isNavLink(props)) {
    const { renderType: _, ...rest } = props
    return (
      <NavLinkImpl
        {...rest}
        className={clsx([commonClassName, props.className])}
        activeClassName={clsx(activeClassName)}
      />
    )
  }

  const { renderType: _, ...rest } = props

  return <Link {...rest} className={clsx([commonClassName, props.className])} />
}

export default NavLink
