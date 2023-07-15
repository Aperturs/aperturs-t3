import React from 'react'

import { ContentFocus, ProfileOwnedByMe, useCreatePost,  } from '@lens-protocol/react-web';
import { toast } from 'react-hot-toast';

export function Composer({ publisher,content }: { publisher: ProfileOwnedByMe,content:string }) {


const { execute: create, error, isPending } = useCreatePost({  publisher, upload: uploadJson });

// Upload function
async function uploadJson(data: unknown) {
  try {
    const response = await fetch('/api/lens/upload', {
      method: 'POST',
      body: JSON.stringify(data), 
    })
    const json = await response.json()
    return json.url
  } catch(err) {
    console.log({ err })
  }
}

// create post function
async function createPost() {
  await create({
    content: content,
    contentFocus: ContentFocus.TEXT_ONLY,
    locale: 'en',
  }).then(()=>{
    toast.success("Posted to Lens");
  })
}

  return (
    <div>
      <button className={`btn btn-outline btn-primary w-full ${isPending && 'loading'}`} disabled={isPending} onClick={createPost}>Post to Lens</button>
    </div>
  )
}

