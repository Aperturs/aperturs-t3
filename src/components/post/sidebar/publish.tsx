import React from 'react'
import { SimpleButton } from './common'
import Picker from '~/components/custom/datepicker/picker'
import { useStore } from '~/store/post-store';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';

function Publish() {
    const { tweets, linkedinPost } = useStore(state =>({
        tweets: state.tweets,
        linkedinPost: state.linkedinPost
      }),shallow)
    
      const handlePublish = () => {
        console.log("tweets", tweets);
        console.log("linkedinPost", linkedinPost);
        let tweetss = "";
        for (let i = 0; i < tweets.length; i++) {
          let tweetid = tweets[i]?.id;
          let tweettext = tweets[i]?.text;
          tweetss += `id: ${tweetid} text: ${tweettext} \n`;
        }
        toast(`tweets: ${tweetss} \n linkedinPost: ${linkedinPost}`);
      };
      
  return (
    <div className="my-4 flex flex-grow flex-col justify-end gap-1">
    <div className="flex gap-1">
      <Picker />
      <SimpleButton text="Schedule" onClick={() => {}} />
    </div>
    <SimpleButton text="Publish Now" onClick={handlePublish} />
    <SimpleButton text="Save" onClick={() => {}} />
    <SimpleButton text="Add to Queue" onClick={() => {}} />
    </div>
  )
}

export default Publish
