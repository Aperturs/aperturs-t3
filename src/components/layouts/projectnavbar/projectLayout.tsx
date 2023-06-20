import React from 'react'
import ProjectNavBar from './projectnavbar'


function projectLayout({children}:{children: React.ReactNode}) {
  return (
    <div className='w-full flex flex-col items-center'>
      <ProjectNavBar />
      <div className='my-3 '>
      {children}
      </div>
    </div>
  )
}

export default projectLayout
