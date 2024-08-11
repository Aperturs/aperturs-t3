import { shallow } from "zustand/shallow";

import { Card, CardContent, CardHeader, CardTitle } from "@aperturs/ui/card";

import { useStore } from "~/store/post-store";
import SingleTweet from "./singleTweet";

function TweetPost({ socialId }: { socialId?: string }) {
  const { post } = useStore(
    (state) => ({
      post: state.post,
    }),
    shallow,
  );

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Create a post</CardTitle>
      </CardHeader>
      <CardContent>
        {post.content.map((tweet) => {
          return (
            <>
              <SingleTweet
                key={tweet.id}
                orderId={tweet.order}
                text={tweet.text}
                socialId={socialId}
                socialType={tweet.socialType}
              />
              {/* <FileUpload
                socialId={socialId}
                socialType={tweet.socialType}
                key={tweet.id}
                orderId={tweet.order}
              /> */}
            </>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default TweetPost;
