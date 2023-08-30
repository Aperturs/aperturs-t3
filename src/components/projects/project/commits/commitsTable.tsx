import {
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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

export default function CommitsTable({ rows }: { rows: ICommit[] }) {
  // const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const { commits, setCommits } = useGithubStore((state) => ({
    commits: state.commits,
    setCommits: state.setCommits,
  }));
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

  const generatePost = () => {
    setOpen(!open);
    // console.log("generate post");
  };
  return (
    <Card className="w-[90vw] p-4 shadow-sm lg:w-[70vw] ">
      <div className="flex items-center justify-between">
        <Typography variant="h5">Commits</Typography>
        <button className="btn-primary btn text-white" onClick={generatePost}>
          Generate Post
        </button>
      </div>
      <div className="mb-4 flex items-center">
        <Checkbox
          color="blue"
          checked={commits.length === rows.length}
          onChange={toggleSelectAll}
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
                    />
                    <div>
                      <Typography variant="h6" className="text-blue-gray-800 ">
                        {row.message}
                      </Typography>
                      <Typography variant="body2">
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
          {/* {isLoading ? <LogoLoad size="24" /> : <div>Generated Post</div>} */}
          <GeneratedPostsCard
            posts={[
              "post1 fsdakhfj dafjkh dsakjfh aksjdh fkas",
              "pofsdajfh kjsa fjkhsd akfksahf st2",
              "pos fsdajhfs adfjkh asf t3",
            ]}
          />
        </DialogBody>
      </Dialog>
    </Card>
  );
}

function GeneratedPostsCard({ posts }: { posts: string[] }) {
  const [selectedPost, setSelectedPost] = useState(posts[0]);
  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <Card
          className={`cursor-pointer border-gray-800 p-4 shadow-sm  hover:shadow-md ${
            selectedPost === post ? "border-2 " : ""
          }`}
          key={post}
          onClick={() => setSelectedPost(post)}
        >
          <Typography variant="p">{post}</Typography>
        </Card>
      ))}
      <button className="btn btn-primary text-white">Save Post</button>
    </div>
  );
}
