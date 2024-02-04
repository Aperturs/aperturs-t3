"use client";

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Switch } from "~/components/ui/switch";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";
import { SocialIcon } from "../common";

function SocialsMenu() {
  const { content } = useStore((state) => ({
    content: state.content,
  }));

  if (!content.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" className="my-1 ml-2 max-h-fit">
          <IoIosArrowDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {content.map((item) => {
          if (item.socialType === SocialType.Default) return null;
          return (
            <DropdownMenuItem key={item.id}>
              <MenuItems
                type={item.socialType}
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
  type: string;
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
      console.log(content[0]?.content);
      updatedContent = content.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            content: content[0]?.content || "",
            unique: true,
          };
        }
        return item;
      });
    }
    setContent(updatedContent);
  };

  return (
    <div key={type}>
      <div
        className="flex cursor-pointer items-center justify-between gap-2"
        onClick={(event) => {
          event.stopPropagation();
          handleChange();
        }}
      >
        <div className={`flex items-center gap-2 py-1`}>
          <div className={`pl-[7px]`}>
            <SocialIcon type={type} size="md" />
          </div>
          <span className={`text-sm`}>{name}</span>
        </div>
        <Switch
          checked={checked}
          // onChange={() => {
          //   handleChange();
          // }}
          className="text-primary"
        />
      </div>
    </div>
  );
};
