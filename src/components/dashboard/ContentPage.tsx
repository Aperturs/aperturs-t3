import React from "react";
import { CreateButton } from "~/components";
import { useSession } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Image from "next/image";

const ContentPage = () => {
  const [clientId, setClientId] = React.useState("");
  const [bearerToken, setbearerToken] = React.useState("");
  const { session } = useSession();

  return (
    <div>
      <div className="flex w-full justify-between">
        <h2 className="text-2xl font-bold">Content</h2>
        <CreateButton text="Create" />          
      </div>
      

    </div>
  );
};

export default ContentPage;
