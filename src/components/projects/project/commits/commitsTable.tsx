import {
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGithub } from "~/hooks/useGithub";
import { useGithubStore } from "~/store/github-store";
import { api } from "~/utils/api";

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

function getPullRequestId(commit: string): string | null {
  const message = commit.toLowerCase();
  const regex = /merge pull request #(\d+) from/;
  const match = message.match(regex);
  if (match && match.length >= 2) {
    return match[1] || null;
  } else {
    return null;
  }
}

interface CommitTableProps {
  rows: ICommit[];
  projectName: string;
  ProjectTagline: string;
  projectDescription: string;
  accessToken: string;
}

export default function CommitsTable({
  rows,
  projectDescription,
  projectName,
  ProjectTagline,
  accessToken
}: CommitTableProps) {
  // const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const { commits, setCommits } = useGithubStore((state) => ({
    commits: state.commits,
    setCommits: state.setCommits,
  }));
  const {getPullRequestById} = useGithub(accessToken);
  const [open, setOpen] = useState(false);
  const {
    data: generatedPosts,
    mutateAsync: generatePosts,
    error: generationError,
    isLoading,
  } = api.github.post.generatePost.useMutation();

  const toggleSelectAll = () => {
    if (commits.length === rows.length) {
      setCommits([]);
    } else {
      setCommits([...rows]);
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
    setOpen(!open);
    if (!open) {
      toast
        .promise(
          generatePosts({
            ProjectName: projectName,
            ProjectDescription: projectDescription + "",
            ProjectContext: ProjectTagline,
            CommitInformation: `${commits.toString()}`,
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
    }
    // console.log("generate post");
  };
  return (
    <Card className="w-[90vw] p-4 shadow-sm lg:w-[70vw] ">
      <div className="flex items-center justify-between">
        <Typography variant="h5">Commits</Typography>
        <button
          className="btn btn-primary text-white"
          disabled={isLoading}
          onClick={generatePost}
        >
          Generate Post
        </button>
      </div>
      <div className="mb-4 flex items-center">
        <Checkbox
          color="blue"
          checked={commits.length === rows.length}
          onChange={toggleSelectAll}
          crossOrigin={undefined}
        />
        <Typography variant="h6" className="ml-2">
          {commits.length} row (s) selected
        </Typography>
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
                  <div className="flex items-center">
                    <Checkbox
                      color="blue"
                      checked={commits.some((commit) => commit.id === row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      crossOrigin={undefined}
                    />
                    <div>
                      <Typography variant="h6" className="text-blue-gray-800 ">
                        {row.message}
                      </Typography>
                      <Typography>
                        Created on {row.date} by {row.author}
                      </Typography>
                    </div>
                  </div>
                  <Chip
                    variant="ghost"
                    className="bg-secondary "
                    value={`${
                      isPullRequestMergeCommit(row.message)
                        ? "Pull Request"
                        : "Commit"
                    }`}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Dialog
        open={open}
        handler={generatePost}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Generated Posts</DialogHeader>
        <DialogBody>
          {isLoading ? (
            <Spinner scale={30} />
          ) : generatedPosts?.data ? (
            <GeneratedPostsCard posts={generatedPosts.data || []} />
          ) : (
            <Typography color="red">{generationError?.message}</Typography>
          )}
        </DialogBody>
      </Dialog>
    </Card>
  );
}

function GeneratedPostsCard({ posts }: { posts: string[] }) {
  const [selectedPost, setSelectedPost] = useState(posts[0]);
  const {
    mutateAsync: savePost,
    isLoading,
    error,
  } = api.savepost.savePost.useMutation();

  const router = useRouter();

  const handleSavePost = () => {
    const projectId = router.query.id as string;
    if (!selectedPost) {
      toast.error("Please select a post");
      return;
    }
    toast
      .promise(
        savePost({
          defaultContent: selectedPost,
          selectedSocials: [],
          projectId: projectId,
          postContent: [],
        }),
        {
          loading: "Saving Post",
          success: "Post Saved",
          error: `${error?.message ? error?.message : "Something went wrong"}`,
        }
      )
      .then(async (res) => {
        if (res.success) {
          await router.push(`/project/${projectId}/drafts`);
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
            selectedPost === post ? "border-2 " : ""
          }`}
          key={post}
          onClick={() => setSelectedPost(post)}
        >
          <Typography variant="paragraph">{post}</Typography>
        </Card>
      ))}
      <button
        className={`btn btn-primary text-white ${isLoading ? "loading" : ""}`}
        onClick={handleSavePost}
        disabled={isLoading}
      >
        Save Post
      </button>
    </div>
  );
}
