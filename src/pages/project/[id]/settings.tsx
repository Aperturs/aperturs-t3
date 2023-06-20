import React, { ReactElement } from 'react'
import { CommitDescriptionSettingsCard, CommitSettings, Layout, ProjectLayout } from '~/components'

const Settings = () => {
  return (
    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-11'>
      <CommitSettings />
      <CommitDescriptionSettingsCard />
    </div>
  )
}


Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <ProjectLayout>
      {page}
      </ProjectLayout>
    </Layout>
  )
}


export default Settings
