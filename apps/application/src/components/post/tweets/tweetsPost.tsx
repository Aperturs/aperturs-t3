import { shallow } from "zustand/shallow";

import type { SocialType } from "@aperturs/validators/post";
import { Card, CardContent, CardHeader, CardTitle } from "@aperturs/ui/card";

import { useStore } from "~/store/post-store";
import FileUpload from "../content/fileUpload";
import { AiCombobox } from "./ai-popover";
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

  const postContentHere = socialId
    ? post.alternativeContent.find(
        (item) => item.socialProvider.socialId === socialId,
      ) ?? post
    : post;

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Create a post</CardTitle>
      </CardHeader>
      <CardContent>
        {postContentHere.content.map((tweet) => {
          return (
            <>
              <SingleTweet
                key={tweet.order + "text" + socialId}
                orderId={tweet.order}
                text={tweet.text}
                socialId={socialId}
                socialType={socialType}
              />
              <FileUpload
                socialId={socialId}
                socialType={socialType}
                key={tweet.order + "file" + socialId}
                orderId={tweet.order}
              />
              <AiCombobox />
            </>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default TweetPost;
