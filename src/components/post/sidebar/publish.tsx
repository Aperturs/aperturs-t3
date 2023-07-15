import React from 'react'
import { SimpleButton } from './common'
import Picker from '~/components/custom/datepicker/picker'
import { useStore } from '~/store/post-store';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';
import { type SelectedSocial, SocialType, type Tweet } from '~/types/post-types';
import { api } from '~/utils/api';
import { ContentFocus, useActiveProfile } from '@lens-protocol/react-web';
import { useLensPost } from './postLens';

function Publish() {
    const { tweets, linkedinPost,selectedSocials } = useStore(state =>({
        tweets: state.tweets,
        linkedinPost: state.linkedinPost,
        selectedSocials: state.selectedSocials
      }),shallow)
      const {mutateAsync:createTweet,error:twitterError, isLoading:tweeting} = api.twitter.postTweet.useMutation()
      const {mutateAsync:createLinkedinPost,isLoading:linkedinPosting,error:linkedinError} = api.linkedin.postToLinkedin.useMutation()


      const handlePublish = async (tweets: Tweet[], linkedinPost: string) => {
        for (const item of selectedSocials) {
          switch (item.type) {
            case `${SocialType.Twitter}`:
              await createTweet({ tokenId: item.id, tweets });
              if (twitterError) {
                toast.error(`Failed to post to Twitter: ${twitterError.message}`);
              } else {
                toast.success("Posted to Twitter");
              }
              break;
            case `${SocialType.Linkedin}`:
              console.log("linkedin trying");
              await createLinkedinPost({ tokenId: item.id, content: linkedinPost });
              if (linkedinError) {
                toast.error(`Failed to post to LinkedIn: ${linkedinError.message}`);
              } else {
                toast.success("Posted to Linkedin");
              }
              break;
            case `${SocialType.Lens}`:
              if(item.lensProfile){
                console.log("lens trying")
                try{
                  console.log("trying to post to lens")
              const { createPost:lensCreatePost, isPosting:lensPosting } = useLensPost(item.lensProfile);
              await lensCreatePost(linkedinPost);
                }catch(e){
                  console.log(e)
                }
              }
              break;
            default:
              console.log('Unsupported social media type');
          }
        }
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
