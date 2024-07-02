import React from "react";
import {
  Cog6ToothIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";

import BillingTab from "./billingTab";
import UserProfilePage from "./user-profile";

const Test = () => {
  return <div className="w-full py-5">comming soon..</div>;
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
      element: BillingTab,
    },
    {
      label: "Settings",
      value: "settings",
      icon: Cog6ToothIcon,
      element: Test,
    },
  ];
  return (
    <Tabs defaultValue="account">
      <TabsList className="text-center">
        {data.map(({ label, value, icon }) => (
          <TabsTrigger key={value} value={value}>
            <div className="flex items-center gap-2">
              {React.createElement(icon, { className: "w-5 h-5" })}
              {label}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
      {data.map(({ value, element }) => (
        <TabsContent key={value} value={value}>
          <div className="w-full">{React.createElement(element)}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
