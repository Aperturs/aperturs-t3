import CommitsTable from "~/components/projects/project/commits/commitsTable";
import { api } from "~/trpc/server";

export interface TableRow {
  id: number;
  message: string;
  author: string;
  date: string;
}

export default async function CommitsPage({
  params,
}: {
  params: { id: string };
}) {
  // const router = useRouter();
  // const id = router.query.id as string;
  const project = await api.github.getCommits({
    projectId: params.id,
  });
  //   const githubTokens = await api.user.getGithubAccounts();
  //   const { getCommits } = useGithub(
  //     githubTokens?.at(0)?.access_token ?? ""
  //   );
  //   //   const [tableRows, setTableRows] = useState([] as TableRow[]);

  //   const owner = getUsername(project?.repoUrl ?? "");
  //   const repo = project?.repoName;
  //   console.log({ owner, repo });
  //   if (!owner || !repo) return;
  //   const res = await getCommits(owner, repo);

  const data = project?.commits?.data ?? [];

  const newTablesRows: TableRow[] = data.map((commit, index) => {
    return {
      id: index,
      author: commit.commit.author?.name,
      message: commit.commit.message,
      date: Intl.DateTimeFormat("en", {
        dateStyle: "short",
      }).format(new Date(commit.commit.committer?.date ?? "")),
    } as TableRow;
  });

  return (
    <CommitsTable
      rows={newTablesRows}
      projectName={project?.project?.repoName ?? ""}
      ProjectTagline={project?.project?.repoDescription ?? ""}
      projectDescription={
        // project?.project?.questionsAnswersJsonString?.toString() ?? ""
        ""
      }
      params={params}
    />
  );
}
