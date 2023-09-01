import {
  Cog6ToothIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React from "react";
import UserProfilePage from "./userprofile";

const Test = () => {
  return <div className="w-full bg-black">comming soon..</div>;
};

export default function AccountTabs() {
  const data = [
    {
      label: "Account",
      value: "account",
      icon: UserCircleIcon,
      element: UserProfilePage,
    },
    {
      label: "Billing",
      value: "billing",
      icon: Square3Stack3DIcon,
      element: Test,
    },
    {
      label: "Settings",
      value: "settings",
      icon: Cog6ToothIcon,
      element: Test,
    },
  ];
  return (
    <Tabs value="account">
      <TabsHeader className="w-full text-center">
        {data.map(({ label, value, icon }) => (
          <Tab key={value} value={value}>
            <div className="flex w-full items-center gap-2">
              {React.createElement(icon, { className: "w-5 h-5" })}
              {label}
            </div>
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody className="w-full">
        {data.map(({ value, element }) => (
          <TabPanel key={value} value={value}>
            <div className="w-full">{React.createElement(element)}</div>
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
