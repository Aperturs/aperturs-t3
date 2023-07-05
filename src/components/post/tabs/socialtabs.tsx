import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import LinkedinPostCard from "../linkedin/LinkedinPostCard";
import TweetEntry from "~/components/dashboard/CreateContent/TweetEntry";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import TweetPost from "../tweets/tweetsPost";
 
export default function SocialTabs() {

  return (
    <div className="w-full">
    <Tabs  value="twitter" >
      <TabsHeader className="w-52">
         <Tab  value="twitter">
            <div className="flex items-center gap-2">
                <AiOutlineTwitter />
              Twitter
            </div>
          </Tab>
          <Tab  value="linkedin">
            <div className="flex items-center gap-2">
                <FaLinkedinIn/>
             Linkedin
            </div>
          </Tab>
          
      </TabsHeader>
      <TabsBody>
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