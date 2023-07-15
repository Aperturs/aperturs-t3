import { ContentFocus, ProfileOwnedByMe, useActiveProfile, useCreatePost } from "@lens-protocol/react-web";
import { useEffect, useState } from "react";

export const useLensPost = (publisher:ProfileOwnedByMe) => {
  const [isPosting, setIsPosting] = useState(false);

  

  const uploadJson = async (data: unknown) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const json = await response.json()
      return json.url
    } catch(lensError) {
    }
  }

  const { execute: create, error:postingError, isPending } = useCreatePost({ publisher, upload: uploadJson });


  const createPost = async (content: string) => {
    if(publisher){
      setIsPosting(true);
      try {
        await create({
          content: content,
          contentFocus: ContentFocus.TEXT_ONLY,
          locale: 'en',
        })
      } catch (postingError) {
        console.log(postingError)
      } finally {
        setIsPosting(false);
      }
    }
  }
  

  return { createPost, isPosting };

}


