/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/jsx-key */
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
import LinkedinPostCard from "../linkedin/LinkedinPostCard";
import TweetPost from "../tweets/tweetsPost";

export default function SocialTabs() {
  const { content } = useStore((state) => ({
    content: state.content,
  }));
  return (
    <div className="w-full">
      <Tabs value="twitter">
        <TabsHeader className="w-auto">
          {content.map((item) => (
            <Tab value={item.socialType}>
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
        </TabsHeader>
        <TabsBody>
          {content.map((item) => (
            <TabPanel value={item.socialType}>
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
