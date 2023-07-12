import React from 'react'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'

function Test() {

    const {mutateAsync:createpost,data,isLoading} = api.linkedin.postToLinkedin.useMutation()
  return (
    <div>
     Let's make all the test here

     <button 
     onClick={() => {
        createpost({tokenid:11,content:'Hello World testing something cool'}).then(()=>{
            toast.success("posted")
        })
     }}
     >
         Click me to post "Hello World"
     </button>
    </div>
  )
}

export default Test
