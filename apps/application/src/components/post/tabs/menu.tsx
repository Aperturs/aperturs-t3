"use client";

import { useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import type { SocialType } from "@aperturs/validators/post";
import { Button } from "@aperturs/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@aperturs/ui/dropdown-menu";

import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";

function SocialsMenu() {
  const { socials, post } = useStore((state) => ({
    socials: state.socialProviders,
    post: state.post,
  }));

  // Calculate the number of social providers without alternative content
  const socialsWithoutAlternative = useMemo(() => {
    return socials.filter(
      (social) =>
        !post.alternativeContent.some(
          (altContent) =>
            altContent.socialProvider.socialId === social.socialId,
        ),
    );
  }, [socials, post.alternativeContent]);

  if (!socials.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" className="my-1 ml-2 max-h-7">
          <IoIosArrowDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {socials.map((item) => {
          const isAlternative = post.alternativeContent.some(
            (altContent) =>
              altContent.socialProvider.socialId === item.socialId,
          );
          const isSingleLeftover =
            socialsWithoutAlternative.length === 1 &&
            socialsWithoutAlternative[0] &&
            socialsWithoutAlternative[0].socialId === item.socialId;
          // Show item if it's an alternative or if it's not the single leftover socialProvider
          if (isAlternative || !isSingleLeftover) {
            return (
              <DropdownMenuItem key={item.socialId}>
                <MenuItems
                  type={item.socialType}
                  name={item.name}
                  id={item.socialId}
                />
              </DropdownMenuItem>
            );
          }

          return null;
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
}: {
  type: SocialType;
  name: string;
  id: string;
}) => {
  const { setPost, post } = useStore((state) => ({
    setPost: state.setPost,
    post: state.post,
  }));

  const unique = post.alternativeContent.some(
    (item) => item.socialProvider.socialId === id,
  );
  const [checked, setChecked] = useState<boolean>(unique);

  const handleChange = () => {
    let updatedPost = post.alternativeContent;
    if (unique) {
      setChecked(false);
      updatedPost = updatedPost.filter(
        (item) => item.socialProvider.socialId !== id,
      );
      setPost({
        ...post,
        alternativeContent: updatedPost,
      });
    } else {
      setChecked(true);
      updatedPost = [
        ...updatedPost,
        {
          socialProvider: { socialType: type, name, socialId: id },
          content: [
            {
              id: "",
              order: 0,
              name: name,
              media: [],
              text: post.content[0] ? post.content[0].text : "",
              tags: [],
              socialId: id,
            },
          ],
        },
      ];
    }
    setPost({
      ...post,
      alternativeContent: updatedPost,
    });
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
    </DropdownMenuCheckboxItem>
  );
};
