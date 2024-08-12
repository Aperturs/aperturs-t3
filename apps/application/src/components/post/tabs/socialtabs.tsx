import type { SocialType } from "@aperturs/validators/post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";
import { SocialTypes } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";
import usePost from "../content/use-post";
import Youtube from "../content/youtube";
import TweetPost from "../tweets/tweetsPost";
import SocialsMenu from "./menu";

export default function SocialTabs() {
  const { post, postType, socialProviders } = useStore((state) => ({
    post: state.post,
    postType: state.postType,
    socialProviders: state.socialProviders,
  }));

  const { getValidAlternativeContent, getSocialTypeOfContent } = usePost();

  return (
    <div className="w-full">
      {postType === "NORMAL" && (
        <>
          {socialProviders.length > 1 ? (
            <Tabs defaultValue={SocialTypes.DEFAULT}>
              <TabsList>
                <TabsTrigger value={SocialTypes.DEFAULT}>
                  <div className="flex items-center gap-2 capitalize">
                    <SocialIcon
                      type={getSocialTypeOfContent.socialType}
                      size="md"
                    />
                    <span>{getSocialTypeOfContent.name}</span>
                  </div>
                </TabsTrigger>
                {getValidAlternativeContent.map((item) => (
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
                <SocialsMenu />
              </TabsList>
              <TabsContent value={SocialTypes.DEFAULT}>
                <TweetPost socialType={getSocialTypeOfContent.socialType} />
              </TabsContent>
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
            <TweetPost socialType={getSocialTypeOfContent.socialType} />
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
