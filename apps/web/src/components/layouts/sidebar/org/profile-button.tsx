"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useS3Upload } from "next-s3-upload";
import toast from "react-hot-toast";
import { FaPlusCircle } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";

import type { Option } from "@aperturs/ui/auto-complete";
import { Avatar, AvatarFallback, AvatarImage } from "@aperturs/ui/avatar";
import { Button } from "@aperturs/ui/button";
import { Card } from "@aperturs/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@aperturs/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@aperturs/ui/dialog";
import { Input } from "@aperturs/ui/input";
import { cn } from "@aperturs/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@aperturs/ui/popover";

import { api } from "~/trpc/react";
import { BusinessCategory } from "./business-catagories";
import UploadImage from "./upload-image";

export default function ProfileButton() {
  const { user } = useUser();
  console.log(user?.imageUrl, "user");
  const { data, isLoading } =
    api.organisation.basics.getAllUserOrganisations.useQuery();
  const params = useParams<{ orgid: string }>();
  const orgId = params?.orgid ;
  const currentOrg = data?.find((org) => org.id === orgId);

  return (
    <Dialog>
      <Popover>
        <PopoverTrigger className="w-full">
          {currentOrg ? (
            <CurrentOrganisation
              avatar={currentOrg.logo ?? "/user.png"}
              name={currentOrg.name}
              email={currentOrg.category}
            />
          ) : (
            <CurrentOrganisation
              avatar={user?.imageUrl ?? "/user.png"}
              name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
              email={user?.primaryEmailAddress?.emailAddress ?? ""}
            />
          )}
        </PopoverTrigger>
        <PopoverContent className="z-[200] pt-4">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Personal">
                <OrganisationItem
                  name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                  logo={user?.imageUrl ?? "/user.png"}
                  link="/dashboard"
                  current={!orgId}
                  subheading={"personal"}
                />
              </CommandGroup>
              <CommandGroup heading="Organisations">
                {data?.map((item) => {
                  return (
                    <OrganisationItem
                      key={item.id}
                      name={item.name}
                      logo={item.logo ?? undefined}
                      link={`/organisation/${item.id}/dashboard`}
                      current={item.id === orgId}
                      subheading={item.category}
                    />
                  );
                })}
              </CommandGroup>
              <DialogTrigger asChild>
                <Button
                  className="my-2 flex w-full gap-3"
                  onClick={() => {
                    console.log("clicked");
                  }}
                >
                  <FaPlusCircle className="text-lg" />
                  Create New Organisation
                </Button>
              </DialogTrigger>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateOrganisationDialog />
    </Dialog>
  );
}

interface CurrentOrganisationProps {
  avatar: string;
  name: string;
  email: string;
}
function CurrentOrganisation({
  avatar,
  name,
  email,
}: CurrentOrganisationProps) {
  return (
    <Card
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2 border-none bg-secondary p-3 text-start",
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={avatar} alt="avatar" className="rounded-full" />
          <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="capitalize">{name}</h3>
          <p className="break-links max-w-36 break-words text-xs text-muted-foreground">
            {email}
          </p>
        </div>
      </div>
      <LuChevronsUpDown className="text-base text-muted-foreground" />
      {/* <AvatarFallback>U</AvatarFallback> */}
    </Card>
  );
}

function CreateOrganisationDialog() {
  const {
    mutateAsync: createOrganisation,
    isPending: creatingOrganisation,
    error,
  } = api.organisation.basics.createOrganisation.useMutation();
  const [name, setName] = useState("");
  const router = useRouter();
  const [value, setValue] = useState<Option>();
  const [image, setImage] = useState<File | undefined>();
  const { uploadToS3 } = useS3Upload();

  const handleCreateOrganisation = async () => {
    if (!name) return toast.error("Organisation name is required");
    if (!value) return toast.error("Organisation category is required");
    await toast
      .promise(
        (async () => {
          let logo = undefined;
          if (image) {
            const { url } = await uploadToS3(image);
            logo = url;
          }
          const res = await createOrganisation({
            name,
            category: value.label,
            logo,
          });
          return res;
        })(),
        {
          loading: "Creating Organisation...",
          success: "Organisation Created",
          error: (err) =>
            `Failed to create Organisation ${(err as unknown as string) || ""}`,
        },
      )
      .then((res) => {
        console.log(res, "res");
        router.push(`/organisation/${res.id}/dashboard`);
        setTimeout(() => {
          router.refresh();
        }, 2000);
      });
  };

  return (
    <DialogContent>
      <DialogHeader>Create Organisation</DialogHeader>
      <div className="flex flex-col gap-4">
        <UploadImage image={image} setImage={setImage} />
        <Input
          type="text"
          placeholder="Organisation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BusinessCategory value={value} setValue={setValue} />
        <DialogClose asChild>
          <Button
            disabled={creatingOrganisation}
            onClick={handleCreateOrganisation}
          >
            Create Organisation
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

function OrganisationItem({
  name,
  logo,
  subheading,
  link,
  current,
}: {
  name: string;
  logo?: string;
  subheading?: string;
  link: string;
  current: boolean;
}) {
  return (
    <CommandItem
      className={cn(
        "broder-[1px] my-2 cursor-pointer rounded-md border-border !bg-transparent p-2  transition-all hover:!bg-muted",
        current &&
          "!bg-primary !text-white  hover:!bg-primary aria-selected:bg-primary",
      )}
    >
      <Link
        href={`${link}`}
        className="flex h-full w-full items-center justify-between gap-4 px-6"
      >
        <div className="flex items-center gap-2">
          <Image
            src={logo ?? "/user.png"}
            alt={name}
            width={30}
            height={30}
            className="rounded-full object-contain"
          />
          <div className="relative flex flex-1 flex-col">
            {name}
            <span
              className={cn(current ? "text-muted" : "text-muted-foreground")}
            >
              {subheading}
            </span>
          </div>
        </div>
        {current && (
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white "></span>
          </span>
        )}
      </Link>
    </CommandItem>
  );
}
