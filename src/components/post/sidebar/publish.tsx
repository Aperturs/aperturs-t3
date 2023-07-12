import React from 'react'
import { SimpleButton } from './common'
import Picker from '~/components/custom/datepicker/picker'
import { useStore } from '~/store/post-store';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';
import { Tweet } from '~/types/post-types';
import { api } from '~/utils/api';

function Publish() {
    const { tweets, linkedinPost,selectedSocials } = useStore(state =>({
        tweets: state.tweets,
        linkedinPost: state.linkedinPost,
        selectedSocials: state.selectedSocials
      }),shallow)
      const {mutateAsync:createpost,data,isLoading} = api.twitter.postTweet.useMutation()

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
        selectedSocials.forEach((item) => {
          switch(item.type) {
            case 'twitter':
            //   postToTwitter(item.id, twitterContent);
            createpost({tokenid:item.id,tweets}).then(()=>{
                toast.success("posted")
            })
              break;
            case 'linkedin':
            //   postToLinkedIn(item.id, linkedInContent);
              break;
            default:
              console.log('Unsupported social media type');
          }
        });
      };
      
      
  return (
    <div className="my-4 flex flex-grow flex-col justify-end gap-1">
    <div className="flex gap-1">
      <Picker />
      <SimpleButton text="Schedule" onClick={() => {}} />
    </div>
    <SimpleButton isLoading={isLoading} text="Publish Now" onClick={()=>handlePublish(tweets,linkedinPost)} />
    <SimpleButton  text="Save" onClick={() => {}} />
    <SimpleButton text="Add to Queue" onClick={() => {}} />
    </div>
  )
}

export default Publish
