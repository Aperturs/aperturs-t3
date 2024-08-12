"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";

import { Alert, AlertDescription, AlertTitle } from "@aperturs/ui/alert";
import { Button } from "@aperturs/ui/button";
import { Card, CardContent, CardHeader } from "@aperturs/ui/card";
import { Input } from "@aperturs/ui/input";

import { handleTwitterRedirect } from "~/utils/actions/handle-socials";

const AddTwitter = () => {
  const router = useRouter();

  return (
    <div className="w-screen px-10 py-28 md:px-24 lg:px-56">
      <Card>
        <CardHeader>
          <Button
            variant="secondary"
            className="my-2 flex w-44 items-center space-x-2 text-sm"
            onClick={() => router.back()}
          >
            <IoIosArrowBack size={20} />
            <span>Back</span>
          </Button>
        </CardHeader>
        <CardContent className="p-10">
          <h1 className="text-4xl font-medium text-primary">Add Twitter</h1>
          <p className="mt-2 text-gray-500">
            you will need to give your own
            <span className="font-bold text-primary"> Twitter API keys </span>
          </p>
          <p className="text-gray-500">
            you can get them from Twitter Developer Portal
          </p>
          <ApiBox />
        </CardContent>
      </Card>
    </div>
  );
};

function ApiBox() {
  const searchParams = useSearchParams();

  const orgId = searchParams?.get("orgid");
  const tokenId = searchParams?.get("tokenid");
  const isOnboarding = searchParams?.get("onboarding");

  const [clientID, setClientID] = React.useState("");
  const [clientSecret, setClientSecret] = React.useState("");
  const [localLoading, setLocalLoading] = React.useState(false);

  const connectHandler = async () => {
    setLocalLoading(true);
    if (!orgId) {
      toast.error("OrgId is required not found");
      setLocalLoading(false);
      return;
    }
    await handleTwitterRedirect({
      clientId: clientID,
      clientSecret,
      redis: {
        orgId,
        tokenId: tokenId ? tokenId : "new",
        onboarding: isOnboarding === "true",
      },
    });
    setLocalLoading(false);
  };

  return (
    <div className="my-8  flex w-full flex-col rounded-xl">
      <h1 className="text-2xl font-medium text-primary">API Keys</h1>
      <p className="mt-2 text-gray-500">Client ID</p>

      <Input
        // className="my-2 h-auto w-full resize-none rounded-xl border border-primary p-3"
        placeholder="UE05dTJ45jhjTvdEUYQ5aTBIcFo6MTpjaQ"
        value={clientID}
        onChange={(e) => setClientID(e.target.value)}
      ></Input>
      <p className="mt-2 text-gray-500">Client Secret</p>
      <Input
        //   className="h-auto w-full resize-none rounded-xl
        // border border-primary p-3 "
        placeholder="NzEjJmLCdQud4JuKSw2QaLjFv4zSTQWtg31hRwrsdSfw3ayqfq"
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
      />
      <Alert className="my-3 bg-orange-200 dark:bg-orange-700">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <AlertTitle className="font-bold">Bring your Own APIs</AlertTitle>
            <AlertDescription>
              Due to Twitter new APIs rules, we are only allowing user who bring
              their own Api Keys
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <div className="flex w-full justify-end">
        <Button
          className=" mt-4 w-24  rounded-xl px-4 py-2 sm:w-56"
          onClick={connectHandler}
          disabled={localLoading}
        >
          Connect
        </Button>
      </div>
    </div>
  );
}

export default AddTwitter;
