import { useRouter } from 'next/router'
import React from 'react'
import LensAuthenticate from '~/components/lens/lens-auth'

export default function LensProtoCol() {

    const router = useRouter()
  return (
    <div className='w-full min-h-screen  h-full flex justify-center items-center'>
      <div className='shadow-md rounded-lg w-[30vw] p-16'>
        <h1 className='whitespace-nowrap text-center font-semibold text-2xl'>
            Connect your Wallet
        </h1>
        <div className='my-5'>
        <LensAuthenticate />
        <button className='btn w-full' onClick={()=>router.push('/socials')}>
            Go Back
        </button>
        </div>
      </div>
    </div>
  )
}
