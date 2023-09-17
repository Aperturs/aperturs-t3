/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState, type ReactElement } from "react";
import { CommitsTable, Layout, ProjectLayout } from "~/components";
import LogoLoad from "~/components/custom/loading/logoLoad";
import { useGithub } from "~/hooks/useGithub";
import { api } from "~/utils/api";

export interface TableRow {
  id: number;
  message: string;
  author: string;
  date: string;
}

function getUsername(url: string): string | null {
  const regex = /https:\/\/github\.com\/([^\/]+)\/[^\/]+/;
  const match = url.match(regex);

  if (match && match.length >= 2) {
    return match[1] || null;
  } else {
    return null;
  }
}

const CommitsPage = ({ id }: { id: string }) => {
  // const router = useRouter();
  // const id = router.query.id as string;
  const { data: project, isSuccess } =
    api.github.project.getProject.useQuery(id);
  const { data: githubTokens, isLoading } =
    api.user.getGithubAccounts.useQuery();
  const { getCommits, loading } = useGithub(
    githubTokens?.at(0)?.access_token ?? ""
  );
  const [tableRows, setTableRows] = useState([] as TableRow[]);
  const [ranOnce, setranOnce] = useState(false);

  useEffect(() => {
    if (project && isSuccess && !ranOnce) {
      const owner = getUsername(project.repoUrl);
      const repo = project.repoName;
      console.log({ owner, repo });
      if (!owner || !repo) return;
      getCommits(owner, repo)
        .then((res) => {
          if (res) {
            console.log(res, "commmits");
            
            const newTablesRows: TableRow[] = res.data.map((commit, index) => {
              return {
                id: index,
                author: commit.commit.author?.name,
                message: commit.commit.message,
                date: Intl.DateTimeFormat("en", {
                  dateStyle: "short",
                }).format(new Date(commit.commit.committer?.date ?? "")),
              } as TableRow;
            });
            console.log({ newTablesRows });
            setTableRows(newTablesRows);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setranOnce(true);
    }
  }, [getCommits, project, isSuccess, ranOnce]);

  if (!project && !githubTokens) return <LogoLoad size="24" />;
  if (loading || isLoading) return <LogoLoad size="24" />;

  return (
    <div className="">
      <CommitsTable
        rows={tableRows}
        projectName={project?.repoName ?? ""}
        ProjectTagline={project?.repoDescription ?? ""}
        projectDescription={
          project?.questionsAnswersJsonString?.toString() ?? ""
        }
        accessToken={githubTokens?.at(0)?.access_token ?? ""}
      />
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

export const getServerSideProps = (context: any) => {
  const id = context.params.id;

  if (typeof id !== "string") throw new Error("Invalid id");

  return {
    props: {
      id,
    },
  };
};

export default CommitsPage;
