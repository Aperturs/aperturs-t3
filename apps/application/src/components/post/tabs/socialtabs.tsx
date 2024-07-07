import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";
import { SocialType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";
import ContentPostCard from "../content/ContentPostCard";
import Youtube from "../content/youtube";
import TweetPost from "../tweets/tweetsPost";
import SocialsMenu from "./menu";

export default function SocialTabs() {
  const { content, postType } = useStore((state) => ({
    content: state.content,
    postType: state.postType,
  }));

  return (
    <div className="w-full">
      {postType === "NORMAL" && (
        <>
          {content.length > 2 ? (
            <Tabs defaultValue={SocialType.Default}>
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
              id={SocialType.Default}
              postType={SocialType.Default}
            />
          )}
        </>
      )}
      {postType === "LONG_VIDEO" && <Youtube />}
    </div>
  );
}
