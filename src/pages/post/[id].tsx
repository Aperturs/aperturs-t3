import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { Layout, PostView } from '~/components'

export default function Post() {

  const router = useRouter()

  return (
    <div>
       <PostView value={`${router.query.id}`} id={1}/>
    </div>
  )
}

Post.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }
   
