import React, { ReactElement } from 'react'
import { Layout } from '~/components'

function Notifications() {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      you have no notifications
    </div>
  )
}

Notifications.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }

export default Notifications
