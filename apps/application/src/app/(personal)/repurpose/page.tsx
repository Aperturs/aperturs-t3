"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import LinkedInPreviewSkeleton from "~/components/previews/linkedin-preview-skeleton";
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
    await toast.promise(
      generateLinkedin(data).then((res) => {
        setPosts((prev) => [...prev, res.text]);
      }),
      {
        loading: "Generating...",
        success: "Generated",
        error: "Failed to generate",
      },
    );
  };

  return (
    <section className="h-[150vh] p-3">
      <h1 className="mb-1 text-xl font-semibold">
        Articles/Youtube Into Posts
      </h1>
      <p className="my-2 text-muted-foreground">
        Generate Linkedin Posts from Articles or Youtube Videos. Just paste the
        URL and we&apos;ll do the rest.
      </p>
      <RepurposeInput onSubmit={handleSubmit} loading={generating} />
      <hr className="my-4" />
      {generating && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 ">
          <LinkedInPreviewSkeleton />
          <LinkedInPreviewSkeleton />
          <LinkedInPreviewSkeleton />
        </div>
      )}
      {!generating && posts.length > 0 && <GeneratedPosts posts={posts} />}
    </section>
  );
}
