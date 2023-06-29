
import React from 'react'
import { Layout,ProfileHeader,ConnectSocials } from '~/components'

const ProfilePage = () => {



  return (
    <Layout>
        <div className='flex flex-col items-center justify-center'>
            <ConnectSocials />
        </div>
    </Layout>
  )
}

export default ProfilePage
