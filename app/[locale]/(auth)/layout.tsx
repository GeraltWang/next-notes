import React from 'react'

const AuthRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex-center bg-primary-50 min-h-screen w-full bg-dotted-pattern bg-cover bg-fixed bg-center'>
      {children}
    </div>
  )
}

export default AuthRootLayout
