import { Switch } from '@material-tailwind/react'
import React from 'react'
import Picker from '~/components/custom/datepicker/picker'

const SideBar = () => {

  return (
    <div className='lg:right-4 lg:h-[calc(100vh)] z-20 lg:fixed lg:max-w-[20rem] w-full  bg-white rounded-lg p-4   shadow-xl shadow-blue-gray-900/5'>
        tesing
        {/* <Switch
          label="Auto Sync"
          color="blue"
          defaultChecked={sync}
          onChange={(e)=>setSync(e.target.checked)}
          /> */}
        <div className=" justify-end gap-1 my-4">
          <Picker />
          <SimpleButton text="Save" onClick={()=>{}} />
          <SimpleButton text="Schedule" onClick={()=>{}} />
          <SimpleButton text="Add to Queue" onClick={()=>{}} />
          <SimpleButton text="Publish Now" onClick={()=>{}} />
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
      <button className="btn btn-primary text-white px-4" onClick={onClick}>{text}</button>
    )
  }
