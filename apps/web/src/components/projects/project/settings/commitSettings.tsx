"use client";

import { useState } from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";
import { Input } from "@aperturs/ui/input";

export default function CommitSettings() {
  const [commits, setCommits] = useState(0);

  const handleCommitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommits(parseInt(e.target.value, 10));
  };

  return (
    <Card className="mt-6">
      <CardHeader color="blue-gray">
        <h5 className=" grid h-24 place-items-center">Number of Commits</h5>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Select the number of commits for which you want us to generate posts
          for you.
        </p>
        <Input
          type="number"
          placeholder="Number of commits"
          value={commits}
          onChange={handleCommitsChange}
          className="mb-4"
        />
      </CardContent>
      <CardFooter>
        <button
          className="btn btn-primary w-full text-white"
          onClick={() => {
            // Your logic to generate posts based on commits
          }}
        >
          Save
        </button>
      </CardFooter>
    </Card>
  );
}
