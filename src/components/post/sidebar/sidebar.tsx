import { Switch } from '@material-tailwind/react'
import React, { useContext } from 'react'
import Picker from '~/components/custom/datepicker/picker'
import { PostContext } from '../postWrapper'
import toast from 'react-hot-toast'

const SideBar = () => {

    const {tweets,linkedinPost} = useContext(PostContext)

    const handlePublish = () => {
        console.log("tweets", tweets);
        console.log("linkedinPost", linkedinPost);
        let tweetss = ""
        for(let i=0;i<tweets.length;i++){
          let tweetid = tweets[i]?.id
          let tweettext = tweets[i]?.text
          tweetss += `id: ${tweetid} text: ${tweettext} \n`
        }
        toast(`tweets: ${tweetss} \n linkedinPost: ${linkedinPost}`)
      }

  return (
    <div className='lg:right-4 lg:h-[calc(100vh)] z-20 lg:fixed lg:max-w-[20rem] w-full  bg-white rounded-lg p-4   shadow-xl shadow-blue-gray-900/5'>
        
        {/* <Switch
          label="Auto Sync"
          color="blue"
          defaultChecked={sync}
          onChange={(e)=>setSync(e.target.checked)}
          /> */}
        <div className="flex flex-col flex-grow justify-end gap-1 my-4">
          <h2 className='text-xl'>
            Schedule Post
          </h2>
          <div className='flex gap-1 flex-grow w-full'>
          <Picker />
          <SimpleButton text="Schedule Post" onClick={()=>{}} />
          </div>
          <SimpleButton text="Publish Now" onClick={handlePublish} />
          <SimpleButton text="Save" onClick={()=>{}} />
          <SimpleButton text="Add to Queue" onClick={()=>{}} />
        </div>
    </div>
  )
}


export default SideBar

interface SimpleButtonProps{
    text:string,
    onClick:()=>void
  }

const SimpleButton = ({text,onClick}:SimpleButtonProps) => {
    return (
      <button className="btn btn-primary btn-outline text-sm capitalize text-white px-4 " onClick={onClick}>{text}</button>
    )
  }
