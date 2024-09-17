"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import LinkedInPreviewSkeleton from "~/components/previews/linkedin-preview-skeleton";
import GeneratedPosts from "~/components/repurpose/generated-posts";
import RepurposeInput from "~/components/repurpose/input";
import { api } from "~/trpc/react";

export default function RepurposePage() {
  const extractText = api.linkedinAi.extractTextFromUrl.useMutation();
  const summarizeText = api.linkedinAi.summarizeExtractedText.useMutation();
  const generatePost = api.linkedinAi.generatePostFromSummary.useMutation();

  const [posts, setPosts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (data: {
    url: string;
    urlType: "url" | "youtube";
  }) => {
    setIsGenerating(true);
    try {
      await toast.promise(
        (async () => {
          const { extractedText } = await extractText.mutateAsync(data);
          toast.success("Text extracted");

          const { summary } = await summarizeText.mutateAsync({
            extractedText,
          });
          toast.success("Text summarized");

          const { text } = await generatePost.mutateAsync({ summary });
          setPosts((prev) => [...prev, text]);
          toast.success("Post generated");
        })(),
        {
          loading: extractText.isPending
            ? "Extracting content from URL..."
            : summarizeText.isPending
              ? "Summarizing extracted text..."
              : generatePost.isPending
                ? "Generating LinkedIn post..."
                : "Processing...",
          success: "LinkedIn post generated successfully!",
          error: "Failed to generate post",
        },
      );
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setIsGenerating(false);
    }
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
      <RepurposeInput onSubmit={handleSubmit} loading={isGenerating} />
      <hr className="my-4" />
      {isGenerating && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 ">
          <LinkedInPreviewSkeleton />
          <LinkedInPreviewSkeleton />
          <LinkedInPreviewSkeleton />
        </div>
      )}
      {!isGenerating && posts.length > 0 && <GeneratedPosts posts={posts} />}
    </section>
  );
}
