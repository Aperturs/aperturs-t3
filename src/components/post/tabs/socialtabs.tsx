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

  // TODO: You can comment the below code and make a youtube video on how to use useEffect to filter content based on selected social media
  useEffect(() => {
    if (!selectedSocials) {
      setContent([]);
      return;
    }

    const filteredContent = content.filter((contentItem) =>
      selectedSocials.some((item) => item.id === contentItem.id)
    );

    setContent(filteredContent);
  }, [selectedSocials]);


  return (
    <div className="w-full">
      <Tabs value={0}>
        <TabsHeader className="h-10">
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
              {/* {item.socialType === SocialType.Twitter ? (
                <TweetPost />
              ) : ( */}
                <ContentPostCard id={item.id} />
              {/* )} */}
            </TabPanel>
          ))}
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
