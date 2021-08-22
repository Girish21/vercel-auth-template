import * as React from 'react'

const ErrorText: React.FunctionComponent = ({ children }) => {
  return <span className='error-text'>{children}</span>
}

export default ErrorText
