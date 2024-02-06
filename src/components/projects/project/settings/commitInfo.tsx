"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function CommitDescriptionSettingsCard() {
  const [commitDescription, setCommitDescription] = useState("simple");

  const handleCommitDescriptionChange = (value: string | undefined) => {
    if (value) {
      setCommitDescription(value);
    }
  };

  return (
    <Card className="mt-6 ">
      <CardHeader color="blue-gray">
        <h5 className="grid h-24 place-items-center">Commit Description</h5>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Choose the level of detail you write in your commit messages
        </p>
        <Select
          // label="Commit Info"
          value={commitDescription}
          onValueChange={handleCommitDescriptionChange}
        >
          <SelectTrigger className="mb-4 w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="vague">Vague</SelectItem>
            <SelectItem value="descriptive">Descriptive</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <button
          className="btn btn-primary w-full text-white"
          onClick={() => {
            // Your logic to generate posts based on commits
            console.log(`${commitDescription}`);
          }}
        >
          Save
        </button>
      </CardFooter>
    </Card>
  );
}
