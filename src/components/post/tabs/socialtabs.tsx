/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";
import { SocialIcon } from "../common";
import ContentPostCard from "../content/ContentPostCard";
import TweetPost from "../tweets/tweetsPost";
import SocialsMenu from "./menu";

export default function SocialTabs() {
  const { content, selectedSocials, setContent } = useStore((state) => ({
    content: state.content,
    selectedSocials: state.selectedSocials,
    setContent: state.setContent,
  }));

  useEffect(() => {
    console.log(selectedSocials);
    let tempContent = content;
    // basically, if there is no social media selected, there should not be content for that social media
    if(!selectedSocials.length) return setContent([]);
    selectedSocials.forEach((item) => {
        tempContent = tempContent.filter((contentItem) => {
          console.log(contentItem.id, item.id);
          contentItem.id === item.id;
      });
    });
    console.log("selectedSocials", selectedSocials);
    console.log("tempContent", tempContent);
    setContent(tempContent);
  }, [selectedSocials]);

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
            <Tab value={`${item.id}${item.socialType}`} key={item.id}>
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
            <TabPanel key={item.id} value={`${item.id}${item.socialType}`}>
              {item.socialType === SocialType.Twitter ? (
                <TweetPost />
              ) : (
                <ContentPostCard id={item.id} />
              )}
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
