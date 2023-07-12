import React from 'react'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'

function Test() {

    const {mutateAsync:createpost,data,isLoading} = api.twitter.postTweet.useMutation()
  return (
    <div>
     Let's make all the test here

     <button 
     onClick={() => {
        // createpost({id:57,text:'Hello World to twitter again'}).then(()=>{
        //     toast.success("posted")
        // })
     }}
     >
         Click me to post "Hello World"
     </button>
    </div>
  )
}

export default Test
