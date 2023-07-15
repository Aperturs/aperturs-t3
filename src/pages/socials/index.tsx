
import React, { ReactElement } from 'react'
import { Layout,ConnectSocials } from '~/components'

const SocialsPage = () => {

  return (
        <div className='flex flex-col items-center justify-center'>
            <ConnectSocials />
        </div>
  )
}

SocialsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}



export default SocialsPage
