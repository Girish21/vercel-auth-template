import * as React from 'react'
import { NavLink } from 'react-router-dom'
import FormButton from './form-button'

type NavType = {
  isLoggedin: boolean
}

const Nav = ({ isLoggedin }: NavType) => {
  return (
    <div className='header_wrapper'>
      <div className='header_align'>
        <header>
          <nav>
            {isLoggedin ? (
              <>
                <FormButton method='post' action='/_actions/signout'>
                  sign out
                </FormButton>
              </>
            ) : (
              <>
                <NavLink to='/login'>login</NavLink>
                <NavLink to='/signup'>sign up</NavLink>
              </>
            )}
          </nav>
        </header>
      </div>
    </div>
  )
}

export default Nav
