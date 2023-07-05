import React from 'react'

const LogoLoad = ({size}:{size?:string}) => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
    <div className={`${size?`w-${size} h-${size}`:'w-24 h-24'} `}>
    <object type="image/svg+xml" data="/loader.svg" />
    </div>
    </div>
  )
}

export default LogoLoad
