"use client";

import * as React from "react";
import { WiStars } from "react-icons/wi";

import { Button } from "@aperturs/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@aperturs/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@aperturs/ui/popover";

import { api } from "~/trpc/react";
import usePostUpdate from "../content/use-post-update";

export function AiCombobox() {
  const [open, setOpen] = React.useState(false);
  const { data: userPreferences, isPending: fetching } =
    api.user.fetchUserPreferences.useQuery();
  const generateContent =
    api.linkedinAi.generateLinkedinPostBasedOnIdea.useMutation();
  const [loading, setLoading] = React.useState(false);

  const { updateContent } = usePostUpdate(0);
  const [text, setText] = React.useState("");

  const handleGenerate = async (idea: string) => {
    // const res = await generateContent({ idea });
    // updateContent(res.text);
    setLoading(true);
    generateContent.mutate(
      { idea },
      {
        onSuccess: async (data) => {
          setText("");
          console.log(data, typeof data, "data");
          for await (const val of data) {
            setText((prev) => prev + val);
          }
        },
      },
    );
    setLoading(false);
  };

  React.useEffect(() => {
    if (text) {
      updateContent(text);
    }
  }, [text]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={loading}
          size="icon"
          role="combobox"
          aria-expanded={open}
        >
          <WiStars className="text-xl" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="search for topic" />
          <CommandList>
            {fetching && <CommandEmpty>Loading...</CommandEmpty>}
            <CommandGroup heading="create based on topic">
              {userPreferences?.subTopics.map((subTopic) => (
                <CommandItem
                  key={subTopic.value}
                  onSelect={async () => {
                    await handleGenerate(subTopic.value);
                    setOpen(false);
                  }}
                >
                  {subTopic.icon} {"  "} {subTopic.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
