
import { Spinner } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactElement } from "react";
import { CommitsTable, Layout, ProjectLayout } from "~/components";
import { useGithub } from "~/hooks/useGithub";
import { CommitRoot } from "~/types/githubTypes";
import { api } from "~/utils/api";

export interface TableRow {
  id: number;
  message: string;
  author: string;
  date: string;
}

const CommitsPage = () => {
  const router = useRouter()
  const id = router.query.id as string;
  const { data: project } = api.user.getProject.useQuery(id);
  const { data: githubTokens, isLoading } = api.user.getGithubAccounts.useQuery();
  if (!project && !githubTokens) return <Spinner />
  const { getCommits, loading } = useGithub(githubTokens?.at(0)?.access_token ?? "")
  const [commits, setCommits] = useState([] as CommitRoot[])
  const [tableRows, setTableRows] = useState([] as TableRow[])
  useEffect(() => {

    const [owner, repo] = project?.repoName.split("/") as string[];
    if (!owner || !repo) return;
    getCommits(owner, repo).then((res) => {
      if (res) {
        const newTablesRows = res.data.map((commit, index) => {
          return {
            id: index,
            author: commit.committer?.name ?? "",
            message: commit.commit.message,
            date: Intl.DateTimeFormat("en", {
              dateStyle: "short",
            }).format(new Date(commit.commit.committer?.date ?? ""))
          } as TableRow
        })
        setTableRows(newTablesRows)
      }
    })
  }, [])

  return (
    <div className="">
      <CommitsTable rows={tableRows} />
    </div>
  );
};

CommitsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <ProjectLayout>{page}</ProjectLayout>
    </Layout>
  );
};

export default CommitsPage;
