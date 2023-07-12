import React from 'react'
import { SimpleButton } from './common'
import Picker from '~/components/custom/datepicker/picker'
import { useStore } from '~/store/post-store';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';
import { SocialType, Tweet } from '~/types/post-types';
import { api } from '~/utils/api';

function Publish() {
    const { tweets, linkedinPost,selectedSocials } = useStore(state =>({
        tweets: state.tweets,
        linkedinPost: state.linkedinPost,
        selectedSocials: state.selectedSocials
      }),shallow)
      const {mutateAsync:createTweet,data,isLoading:tweeting} = api.twitter.postTweet.useMutation()
      const {mutateAsync:createLinkedinPost,isLoading:linkedinPosting} = api.linkedin.postToLinkedin.useMutation()

    //   const handlePublish = () => {
    //     console.log("tweets", tweets);
    //     console.log("linkedinPost", linkedinPost);
    //     let tweetss = "";
    //     for (let i = 0; i < tweets.length; i++) {
    //       let tweetid = tweets[i]?.id;
    //       let tweettext = tweets[i]?.text;
    //       tweetss += `id: ${tweetid} text: ${tweettext} \n`;
    //     }
    //     toast(`tweets: ${tweetss} \n linkedinPost: ${linkedinPost}`);
    //   };

      const handlePublish = (tweets:Tweet[], linkedinPost:string) => {
        console.log("handle triggering")
        console.log(selectedSocials,"selected")
        selectedSocials.forEach((item) => {
          switch(item.type) {
            case `${SocialType.Twitter}`:
            createTweet({tokenid:item.id,tweets}).then(()=>{
                toast.success("Posted to Twitter")
            })
              break;
            case `${SocialType.Linkedin}`:
                console.log("linkedin trying")
                createLinkedinPost({tokenid:item.id,content:linkedinPost}).then(()=>{
                  toast.success("Posted to Linkedin")
                })
              break;
            default:
              console.log('Unsupported social media type');
          }
        });
      };
      
      
  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
    <div className="grid grid-cols-2 gap-1">
      <Picker />
      <SimpleButton text="Schedule" onClick={() => {}} />
    </div>
    <SimpleButton isLoading={tweeting || linkedinPosting} text="Publish Now" onClick={()=>{
        console.log("onClick event is triggered");
      handlePublish(tweets,linkedinPost)
      }} />
    <SimpleButton  text="Save" onClick={() => {}} />
    <SimpleButton text="Add to Queue" onClick={() => {}} />
    </div>
  )
}

export default Publish
