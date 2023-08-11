/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";
import ContentPostCard from "../content/ContentPostCard";
import TweetPost from "../tweets/tweetsPost";
import SocialsMenu from "./menu";

export default function SocialTabs() {
  const { content } = useStore((state) => ({
    content: state.content,
  }));
  return (
    <div className="w-full">
      <Tabs value={0}>
        <TabsHeader className="h-10 w-1/2">
          <Tab value={0}>
            <div className="flex items-center gap-2">
              {/* <AiOutlineTwitter /> */}
              Default
            </div>
          </Tab>
          {content.map((item) => (
            <Tab value={item.id} key={item.socialType}>
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
          {content.map((item) => (
            <TabPanel key={item.socialType} value={item.id}>
              <ContentPostCard id={item.id} />
            </TabPanel>
          ))}
          <TabPanel value="twitter">
            <TweetPost />
          </TabPanel>
          <TabPanel value={0}>
            <ContentPostCard id={0} />
            {/* <ContentPostCard id={1} /> */}
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}

///
