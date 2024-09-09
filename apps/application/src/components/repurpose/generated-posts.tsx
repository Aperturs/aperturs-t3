"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@aperturs/ui/button";

import { api } from "~/trpc/react";
import usePostUpdate from "../post/content/use-post-update";
import LinkedInPreview from "../previews/linkedin";

interface LinkedInPreviewProps {
  posts: string[];
}

export default function GeneratedPosts({ posts }: LinkedInPreviewProps) {
  const { mutateAsync: savePost, isPending: isSaving } =
    api.savepost.savePost.useMutation();

  const { updateContent } = usePostUpdate(0);
  const router = useRouter();

  const handleSaveToDrafts = async (post: string) => {
    await toast.promise(
      savePost({
        content: [
          {
            name: "DEFAULT",
            media: [],
            text: post,
            order: 0,
            id: "DEFAULT",
          },
        ],
        socialProviders: [],
        postType: "NORMAL",
        alternativeContent: [],
      }),
      {
        loading: "Saving...",
        success: (e) => (
          <div className="flex items-center gap-2">
            <span>Saved to drafts</span>
            <Button>
              <a href={`/post/${e.data}`}>view</a>
            </Button>
          </div>
        ),
        error: "Failed to save",
      },
    );
  };

  return (
    <div className="mt-2 grid w-full grow grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <LinkedInPreview key={i} content={post} showReactions={false}>
          <div className="flex items-center justify-between gap-1">
            <Button
              variant="secondary"
              disabled={isSaving}
              isLoading={isSaving}
              className="w-full"
              onClick={() => handleSaveToDrafts(post)}
            >
              Save to drafts
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                updateContent(post);
                router.push("/post");
              }}
            >
              Open in Editor
            </Button>
          </div>
        </LinkedInPreview>
      ))}
    </div>
  );
}
