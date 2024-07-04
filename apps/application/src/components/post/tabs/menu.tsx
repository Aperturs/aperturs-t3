"use client";

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import { Button } from "@aperturs/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@aperturs/ui/dropdown-menu";
import { SocialType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";

function SocialsMenu() {
  const { content } = useStore((state) => ({
    content: state.content,
  }));

  if (!content.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" className="my-1 ml-2 max-h-7">
          <IoIosArrowDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {content.map((item) => {
          if ((item.socialType as SocialType) === SocialType.Default)
            return null;
          return (
            <DropdownMenuItem key={item.id}>
              <MenuItems
                type={item.socialType as SocialType}
                name={item.name}
                id={item.id}
                unique={item.unique}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SocialsMenu;

const MenuItems = ({
  type,
  name,
  id,
  unique,
}: {
  type: SocialType;
  name: string;
  id: string;
  unique: boolean;
}) => {
  const { setContent, content } = useStore((state) => ({
    setContent: state.setContent,
    content: state.content,
  }));

  const [checked, setChecked] = useState<boolean>(unique);

  const handleChange = () => {
    let updatedContent = [...content];
    if (unique) {
      setChecked(false);
      updatedContent = content.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            unique: false,
          };
        }
        return item;
      });
    } else {
      setChecked(true);
      console.log(content[0]?.content, "content");
      updatedContent = content.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            content: content[0]?.content ?? "",
            unique: true,
          };
        }
        return item;
      });
      console.log(updatedContent, "updatedContent from  tabs/menu");
    }
    setContent(updatedContent);
  };

  return (
    <DropdownMenuCheckboxItem
      key={type}
      className="flex cursor-pointer items-center justify-between gap-2"
      onCheckedChange={handleChange}
      checked={checked}
    >
      <div className={`flex items-center gap-2 py-1`}>
        <div className={`pl-[7px]`}>
          <SocialIcon type={type} size="md" />
        </div>
        <span className={`text-sm`}>{name}</span>
      </div>
      {/* <Switch
        checked={checked}
        // onChange={() => {
        //   handleChange();
        // }}
        className="text-primary"
      /> */}
    </DropdownMenuCheckboxItem>
  );
};
