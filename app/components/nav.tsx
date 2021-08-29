import * as React from 'react'
import NavLink from './nav-link'
import FormButton from './form-button'
import { Theme, useTheme } from '../utils/theme-provider'

type NavType = {
  isLoggedin: boolean
}

const Nav = ({ isLoggedin }: NavType) => {
  const [theme, setTheme] = useTheme()

  return (
    <div className='z-[1] mx-[1.5rem] py-[1.5rem]'>
      <div className='w-[var(--main-content-width)] mx-auto flex items-center flex-row-reverse'>
        <header className='flex'>
          <nav className='flex items-center justify-between space-x-4'>
            {isLoggedin ? (
              <>
                <FormButton method='post' action='/_actions/signout'>
                  sign out
                </FormButton>
              </>
            ) : (
              <>
                <NavLink renderType='nav-link' to='/login'>
                  login
                </NavLink>
                <NavLink renderType='nav-link' to='/signup'>
                  sign up
                </NavLink>
              </>
            )}
            <NavLink
              renderType='button'
              onClick={() =>
                setTheme((prevTheme) =>
                  prevTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK
                )
              }
              suppressHydrationWarning
            >
              {theme && <>{theme === Theme.DARK ? 'light' : 'dark'}</>}
            </NavLink>
          </nav>
        </header>
      </div>
    </div>
  )
}

export default Nav
