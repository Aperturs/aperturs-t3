'use client'

import { Avatar, Switch } from '@material-tailwind/react'
import React, { useContext, useEffect, useState } from 'react'
import LinkedInPostCreation from './textarea'
import { PostContext } from '../postWrapper';

type Tweet = {
  id: number;
  text: string;
};

function convertTweetsToPlaintext(tweets: Tweet[]): string {
  let plaintext = "";

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];

      plaintext += tweet?.text + "\n\n";
    
  }

  return plaintext;
}

function LinkedinPostCard() {

  const {setLinkedinPost,linkedinPost,sync,tweets,setSync } = useContext(PostContext)


  useEffect(() => {
    console.log("from linkedin component", convertTweetsToPlaintext(tweets));
    if (sync) {
      const newLinkedinContent = convertTweetsToPlaintext(tweets);
      setLinkedinPost(newLinkedinContent);
    }
  }, [sync, tweets, setLinkedinPost]);


  return (
      <div className="bg-white rounded-lg w-full shadow-md p-4">
        <div className="flex gap-3">
          <Avatar
            src={"/user.png"||"https://i.pinimg.com/originals/90/a7/f6/90a7f67864acea71fb5ffed6aa6298cb.jpg"}
            size="lg"
            color="blue"
            className="mb-4"

          />
            <div>
              <div className="text-lg font-bold">John Doe</div>
              <div className="text-sm text-gray-500">@John</div>
            </div>
        </div>
        <LinkedInPostCreation 
        content={linkedinPost}
        onContentChange={setLinkedinPost}
        sync={sync}
        />
        <Switch
          label="Sync with Twitter"
          color="blue"
          defaultChecked={sync}
          onChange={(e)=>setSync(e.target.checked)}
          />
        <div>
        </div>

      </div>
  )
}

export default LinkedinPostCard
