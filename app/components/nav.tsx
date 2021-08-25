import * as React from 'react'
import NavLink from './nav-link'
import FormButton from './form-button'

type NavType = {
  isLoggedin: boolean
}

const Nav = ({ isLoggedin }: NavType) => {
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
          </nav>
        </header>
      </div>
    </div>
  )
}

export default Nav
