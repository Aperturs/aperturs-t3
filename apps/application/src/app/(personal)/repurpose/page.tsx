"use client";

import { useState } from "react";

import DraftSkeleton from "~/components/drafts/draft-skeleton";
import GeneratedPosts from "~/components/repurpose/generated-posts";
import RepurposeInput from "~/components/repurpose/input";
import { api } from "~/trpc/react";

export default function RepurposePage() {
  const { mutateAsync: generateLinkedin, isPending: generating } =
    api.linkedinAi.generateLinkedinPostBasedOnUrl.useMutation();
  const [posts, setPosts] = useState<string[]>([]);

  const handleSubmit = async (data: {
    url: string;
    urlType: "url" | "youtube";
  }) => {
    await generateLinkedin(data).then((res) => {
      setPosts((prev) => [...prev, res.text]);
    });
  };

  return (
    <section className="p-3">
      <h1 className="mb-1 text-xl font-semibold">
        Articles/Youtube Into Posts
      </h1>
      <p className="my-2 text-muted-foreground">
        Generate Linkedin Posts from Articles or Youtube Videos. Just paste the
        URL and we&apos;ll do the rest.
      </p>
      <RepurposeInput onSubmit={handleSubmit} />
      <hr className="my-4" />
      {generating && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 ">
          <DraftSkeleton />
          <DraftSkeleton />
          <DraftSkeleton />
        </div>
      )}
      <GeneratedPosts posts={posts} />
    </section>
  );
}
