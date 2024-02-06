"use client";

import { LineWobble } from "@uiball/loaders";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useGithubStore } from "~/store/github-store";
import { api } from "~/utils/api";
import { defaultContent } from "~/utils/basic-functions";

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({ opacity: 1, transition: { delay: i * 0.1 } }),
};

function isPullRequestMergeCommit(commit: string): boolean {
  const message = commit.toLowerCase();
  return (
    message.includes("merge pull request") || message.includes("merge branch")
  );
}
function formatedSavePost(text: string) {
  // Use the regular expression /\n+/g to match one or more consecutive line breaks
  // and replace them with a single space character " "
  return text.replace(/\\n+/g, "\n");
}

// function getPullRequestId(commit: string): string | null {
//   const message = commit.toLowerCase();
//   const regex = /merge pull request #(\d+) from/;
//   const match = message.match(regex);
//   if (match && match.length >= 2) {
//     return match[1] || null;
//   } else {
//     return null;
//   }
// }

interface CommitTableProps {
  rows: ICommit[];
  projectName: string;
  ProjectTagline: string;
  projectDescription: string;
  // accessToken: string;
  params: { id: string };
}

export default function CommitsTable({
  rows,
  projectDescription,
  projectName,
  ProjectTagline,
  params,
}: CommitTableProps) {
  // const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const { commits, setCommits } = useGithubStore((state) => ({
    commits: state.commits,
    setCommits: state.setCommits,
  }));

  const {
    data: generatedPosts,
    mutateAsync: generatePosts,
    error: generationError,
    isLoading,
  } = api.github.post.generatePost.useMutation();

  const toggleSelectAll = () => {
    console.log(commits.length, rows.length);
    if (commits.length === rows.length) {
      setCommits([]);
    } else {
      setCommits([...rows]);
      console.log(commits);
    }
  };

  const toggleRowSelection = (id: number) => {
    if (commits.some((commit) => commit.id === id)) {
      setCommits(commits.filter((commit) => commit.id !== id));
    } else {
      const selectedCommit = rows.find((commit) => commit.id === id);
      if (selectedCommit) {
        setCommits([...commits, selectedCommit]);
      }
    }
  };

  // const handleOpen = () => setOpen(!open);

  const generatePost = () => {
    const CommitInformation = commits.map((commit) => {
      return `${commit.message}`;
    });
    const combinedMessages = CommitInformation.join(" + ");
    console.log(combinedMessages, "combinedMessages");
    toast
      .promise(
        generatePosts({
          ProjectName: projectName,
          ProjectDescription: projectDescription + "",
          ProjectContext: ProjectTagline,
          CommitInformation: combinedMessages,
        }),
        {
          loading: "Generating Posts...",
          success: "Generated Posts",
          error: `${
            generationError?.message
              ? generationError?.message
              : "Something went wrong"
          }`,
        }
      )
      .catch((err) => {
        console.log(err);
      });

    console.log("generate post");
  };

  return (
    <Dialog>
      <Card className="w-[90vw] p-4 lg:w-[70vw] ">
        <div className="flex items-center justify-between">
          <h5>Commits</h5>
          <DialogTrigger asChild>
            <Button disabled={isLoading} onClick={generatePost}>
              Generate Post
            </Button>
          </DialogTrigger>
        </div>

        <div className="mb-4 flex items-center">
          <Checkbox
            color="blue"
            checked={commits.length === rows.length}
            onCheckedChange={toggleSelectAll}
          />
          <h6 className="ml-2">{commits.length} row (s) selected</h6>
        </div>
        <div className="max-h-[80dvh] overflow-y-auto">
          <AnimatePresence>
            {rows.map((row, index) => (
              <motion.div
                key={row.id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerVariants}
                custom={index}
              >
                <Card
                  className="mx-2 my-3 cursor-pointer p-4 shadow-md transition-all duration-200 hover:shadow-sm"
                  onClick={() => toggleRowSelection(row.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={commits.some((commit) => commit.id === row.id)}
                        onCheckedChange={() => toggleRowSelection(row.id)}
                      />
                      <div>
                        <h6 className="text-blue-gray-800 ">{row.message}</h6>
                        <p>
                          Created on {row.date} by {row.author}
                        </p>
                      </div>
                    </div>
                    <Badge>
                      {isPullRequestMergeCommit(row.message)
                        ? "Pull Request"
                        : "Commit"}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <DialogContent className="max-h-[40rem] overflow-scroll">
          <DialogHeader>Generated Posts</DialogHeader>
          {isLoading ? (
            <div className="grid h-24 w-full place-items-center">
              <LineWobble size={80} lineWeight={5} speed={1.75} />
            </div>
          ) : generatedPosts?.data ? (
            <GeneratedPostsCard
              posts={generatedPosts.data || []}
              params={params}
            />
          ) : (
            <p color="red">{generationError?.message}</p>
          )}
        </DialogContent>
      </Card>
    </Dialog>
  );
}

function GeneratedPostsCard({
  posts,
  params,
}: {
  posts: string[];
  params: { id: string };
}) {
  const [selectedPost, setSelectedPost] = useState(posts[0]);
  const {
    mutateAsync: savePost,
    isLoading,
    error,
  } = api.savepost.savePost.useMutation();

  const router = useRouter();
  const { id } = params;
  console.log(selectedPost);

  const handleSavePost = () => {
    const projectId = id;
    if (!selectedPost) {
      toast.error("Please select a post");
      return;
    }
    toast
      .promise(
        savePost({
          projectId: projectId,
          postContent: defaultContent(selectedPost),
        }),
        {
          loading: "Saving Post",
          success: "Post Saved",
          error: `${error?.message ? error?.message : "Something went wrong"}`,
        }
      )
      .then((res) => {
        if (res.success) {
          router.push(`/project/${projectId}/drafts`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <Card
          className={`cursor-pointer border-gray-800 p-4 shadow-md  hover:shadow-md ${
            selectedPost === formatedSavePost(post) ? "border-2 " : ""
          }`}
          key={post}
          onClick={() => setSelectedPost(formatedSavePost(post))}
        >
          {/* {post.split('\\n').map((paragraph, index) => (
            <p className="py-1" key={index}>{paragraph}</p>
          ))} */}
          <p className="whitespace-pre-line">{formatedSavePost(post)}</p>
        </Card>
      ))}
      <Button onClick={handleSavePost} disabled={isLoading}>
        Save Post
      </Button>
    </div>
  );
}
