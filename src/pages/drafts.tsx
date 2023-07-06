'use server'
import React, { ReactElement } from 'react'
import { Layout,DraftPage } from '~/components'


const DraftPost = () => {

  return (
        <div className="relative flex">
        <DraftPage />
        </div>
  )
}

DraftPost.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
 

export default DraftPost
