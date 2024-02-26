import React from 'react'

function Layout({children}:{children:React.ReactNode}) {
  return (
    <main className='roor'>
       <div className='root-container'>
            <div className='wrapper'>
                {children}
            </div>
       </div>
    </main>
  )
}

export default Layout