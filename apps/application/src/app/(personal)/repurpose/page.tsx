"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import LinkedInPreviewSkeleton from "~/components/previews/linkedin-preview-skeleton";
import GeneratedPosts from "~/components/repurpose/generated-posts";
import RepurposeInput from "~/components/repurpose/input";
import { api } from "~/trpc/react";

export default function RepurposePage() {
  const extractText = api.linkedinAi.extractTextFromUrl.useMutation();
  const summarizeText = api.linkedinAi.summarizeExtractedText.useMutation();
  const generatePost = api.linkedinAi.generatePostFromSummary.useMutation();
  const loadingText = useRef<string>("");

  const [posts, setPosts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExtractText = async (data: {
    url: string;
    urlType: "url" | "youtube";
  }) => {
    const { extractedText } = await toast.promise(
      extractText.mutateAsync(data),
      {
        loading: "Extracting text from URL...",
        success: "Text extracted",
        error: "Failed to extract text",
      },
    );
    return extractedText;
  };

  const handleSummarizeText = async (data: { extractedText: string }) => {
    const { summary } = await toast.promise(summarizeText.mutateAsync(data), {
      loading: "Summarizing extracted text...",
      success: "Text summarized",
      error: "Failed to summarize text",
    });
    return summary;
  };

  const handleGeneratePost = async (data: { summary: string }) => {
    const { text } = await toast.promise(generatePost.mutateAsync(data), {
      loading: "Generating LinkedIn post...",
      success: "Post generated",
      error: "Failed to generate post",
    });
    return text;
  };

  const handleSubmit = async (data: {
    url: string;
    urlType: "url" | "youtube";
  }) => {
    setIsGenerating(true);
    try {
      const extractedText = await handleExtractText(data);
      const summary = await handleSummarizeText({ extractedText });
      const post = await handleGeneratePost({ summary });
      setPosts((prev) => [...prev, post]);
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
