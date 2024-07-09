import type {
  BasePostContentType,
  PostContentType,
  SocialType,
} from "@aperturs/validators/post";
import { Button } from "@aperturs/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";
import { SocialTypes } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";
import { SocialIcon } from "../common";
import ContentPostCard from "../content/ContentPostCard";
import Youtube from "../content/youtube";
import TweetPost from "../tweets/tweetsPost";
import SocialsMenu from "./menu";

export default function SocialTabs() {
  const { content, postType, setContent } = useStore((state) => ({
    content: state.content,
    postType: state.postType,
    setContent: state.setContent,
  }));

  const { mutateAsync } = api.post.generate.useMutation();

  return (
    <div className="w-full">
      {postType === "NORMAL" && (
        <>
          {content.length > 2 ? (
            <Tabs defaultValue={SocialTypes.DEFAULT}>
              <TabsList>
                {content.map(
                  (item) =>
                    item.unique && (
                      <TabsTrigger value={item.id} key={item.id}>
                        <div className="flex items-center gap-2 capitalize">
                          <SocialIcon
                            type={item.socialType as SocialType}
                            size="md"
                          />
                          {typeof item.socialType === "string"
                            ? item.socialType.toLowerCase()
                            : ""}
                        </div>
                      </TabsTrigger>
                    ),
                )}
                <SocialsMenu />
              </TabsList>
              {content.map(
                (item) =>
                  item.unique && (
                    <TabsContent key={item.id} value={item.id}>
                      {item.socialType === "TWITTER" ? (
                        <TweetPost contentId={item.id} />
                      ) : (
                        <ContentPostCard
                          id={item.id}
                          postType={item.socialType as SocialType}
                        />
                      )}
                    </TabsContent>
                  ),
              )}
            </Tabs>
          ) : (
            <ContentPostCard
              id={"DEFAULT" as SocialType}
              postType={"DEFAULT"}
            />
          )}
        </>
      )}
      {postType === "LONG_VIDEO" && <Youtube />}
      <Button
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
      >
        Repurpose
      </Button>
    </div>
  );
}
