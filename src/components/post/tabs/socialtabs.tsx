/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";
import LinkedinPostCard from "../content/ContentPostCard";
import TweetPost from "../tweets/tweetsPost";
import SocialsMenu from "./menu";

export default function SocialTabs() {
  const { content } = useStore((state) => ({
    content: state.content,
  }));
  return (
    <div className="w-full">
      <Tabs value="twitter">
        <TabsHeader className="h-10 w-1/2">
          {content.map((item) => (
            <Tab value={item.socialType} key={item.socialType}>
              <div className="flex items-center gap-2 capitalize">
                <SocialIcon type={item.socialType} />
                {typeof item.socialType === "string"
                  ? item.socialType.toLowerCase()
                  : ""}
              </div>
            </Tab>
          ))}
          <Tab value="twitter">
            <div className="flex items-center gap-2">
              <AiOutlineTwitter />
              Twitter
            </div>
          </Tab>
          <Tab value="linkedin">
            <div className="flex items-center gap-2">
              <FaLinkedinIn />
              Linkedin
            </div>
          </Tab>
          <SocialsMenu />
        </TabsHeader>
        <TabsBody>
          {content.map((item) => (
            <TabPanel key={item.socialType} value={item.socialType}>
              <TweetPost />
            </TabPanel>
          ))}
          <TabPanel value="twitter">
            <TweetPost />
          </TabPanel>
          <TabPanel value="linkedin">
            <LinkedinPostCard />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}

///
