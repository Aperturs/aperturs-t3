import React from 'react'
import Image from 'next/image'

const LogoLoad = ({size}:{size?:string}) => {
  return (
    <div className='absolute overflow-hidden max-w-[70vw] w-full h-[calc(100vh-10rem)]  flex justify-center items-center'>
    <div className={`${size?`w-${size} h-${size}`:'w-24 h-24'} `}>
    <object type="image/svg+xml" data="/loader.svg" />
    {/* <Image src='/load1.gif' alt='loader' width={parseInt( '100',10)} height={parseInt( '100',10)}  /> */}
    </div>
    </div>
  )
}

export default LogoLoad
