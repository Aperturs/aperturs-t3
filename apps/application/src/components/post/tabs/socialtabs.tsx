import type { SocialType } from "@aperturs/validators/post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";
import { SocialTypes } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";
import Youtube from "../content/youtube";
import TweetPost from "../tweets/tweetsPost";

export default function SocialTabs() {
  const { post, postType } = useStore((state) => ({
    post: state.post,
    postType: state.postType,
    setPost: state.setPost,
  }));

  // const { mutateAsync, isPending } = api.post.generate.useMutation();

  return (
    <div className="w-full">
      {postType === "NORMAL" && (
        <>
          {post.alternativeContent.length > 2 ? (
            <Tabs defaultValue={SocialTypes.DEFAULT}>
              <TabsList>
                {post.alternativeContent.map((item) => (
                  <TabsTrigger
                    value={item.socialProvider.socialId}
                    key={item.socialProvider.socialId}
                  >
                    <div className="flex items-center gap-2 capitalize">
                      <SocialIcon
                        type={item.socialProvider.socialType as SocialType}
                        size="md"
                      />
                      <span>{item.socialProvider.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
                {/* <SocialsMenu /> */}
              </TabsList>
              {post.alternativeContent.map((item) => (
                <TabsContent
                  key={item.socialProvider.socialId}
                  value={item.socialProvider.socialId}
                >
                  <TweetPost
                    socialType={item.socialProvider.socialType}
                    socialId={item.socialProvider.socialId}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <TweetPost socialType={"DEFAULT"} />
          )}
        </>
      )}
      {postType === "LONG_VIDEO" && <Youtube />}
      {/* <SimpleButton
        onClick={async () => {
          const result = await mutateAsync({
            idea: content[0] ? (content[0].content as string) : "",
          });
          console.log(result, "ai generated");
          console.log(content, "old content");
          const newContent = content.map((item) => {
            if (item.socialType === "LINKEDIN")
              return { ...item, unique: true, content: result.object.linkedin };
            if (item.socialType === "TWITTER")
              return {
                ...item,
                unique: true,
                content: result.object.twitter.map((tweet, index) => ({
                  id: index.toString(),
                  name: item.name,
                  socialType: SocialTypes.TWITTER,
                  unique: true,
                  files: [],
                  uploadedFiles: [],
                  content: tweet,
                })),
              };
            else return item;
          });
          console.log(newContent, "new content");
          setContent(newContent);
        }}
        disabled={isPending}
        isLoading={isPending}
        text="Repurpose Content"
      /> */}
    </div>
  );
}
