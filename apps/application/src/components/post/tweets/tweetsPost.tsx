import { shallow } from "zustand/shallow";

import type { SocialType } from "@aperturs/validators/post";
import { Card, CardContent, CardHeader, CardTitle } from "@aperturs/ui/card";

import { useStore } from "~/store/post-store";
import SingleTweet from "./singleTweet";

function TweetPost({
  socialId,
  socialType,
}: {
  socialId?: string;
  socialType: SocialType;
}) {
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
                socialType={socialType}
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
