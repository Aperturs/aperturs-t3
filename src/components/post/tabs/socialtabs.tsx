import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
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
      <Tabs value={SocialType.Default}>
        <TabsHeader className="h-10">
          <Tab value={SocialType.Default}>
            <div className="flex items-center gap-2">
              {/* <AiOutlineTwitter /> */}
              Default
            </div>
          </Tab>
          {content.map((item) => item.unique && (
            <Tab value={item.id} key={item.id}>
              <div className="flex items-center gap-2 capitalize">
                <SocialIcon type={item.socialType} />
                {typeof item.socialType === "string"
                  ? item.socialType.toLowerCase()
                  : ""}
              </div>
            </Tab>
          
          ))}
          <SocialsMenu />
        </TabsHeader>
        <TabsBody>
          {content.map((item) => item.unique && (
            <TabPanel key={item.id} value={item.id}>
              {/* {item.socialType === SocialType.Twitter ? (
                <TweetPost />
              ) : ( */}
              <ContentPostCard id={item.id} />
              {/* )} */}
            </TabPanel>
          ))}
          <TabPanel value={SocialType.Default}>
            <ContentPostCard id={SocialType.Default} />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}


