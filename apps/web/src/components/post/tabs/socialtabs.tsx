import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";
import { SocialIcon } from "../common";
import ContentPostCard from "../content/ContentPostCard";
import SocialsMenu from "./menu";

export default function SocialTabs() {
  const { content } = useStore((state) => ({
    content: state.content,
  }));

  return (
    <div className="w-full">
      {content.length > 2 ? (
        <Tabs defaultValue={SocialType.Default}>
          <TabsList>
            {content.map(
              (item) =>
                item.unique && (
                  <TabsTrigger value={item.id} key={item.id}>
                    <div className="flex items-center gap-2 capitalize">
                      <SocialIcon type={item.socialType} size="md" />
                      {typeof item.socialType === "string"
                        ? item.socialType.toLowerCase()
                        : ""}
                    </div>
                  </TabsTrigger>
                )
            )}
            <SocialsMenu />
          </TabsList>
          {content.map(
            (item) =>
              item.unique && (
                <TabsContent key={item.id} value={item.id}>
                  <ContentPostCard id={item.id} />
                </TabsContent>
              )
          )}
        </Tabs>
      ) : (
        <ContentPostCard id={SocialType.Default} />
      )}
    </div>
  );
}
