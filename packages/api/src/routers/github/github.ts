import { env } from "../../../env";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { githubPost } from "./post";
import { githubProject } from "./project";

// function getUsername(url: string): string | null {
//   // eslint-disable-next-line no-useless-escape
//   const regex = /https:\/\/github\.com\/([^\/]+)\/[^\/]+/;
//   const match = url.match(regex);

//   if (match && match.length >= 2) {
//     return match[1] ?? null;
//   } else {
//     return null;
//   }
// }

export const github = createTRPCRouter({
  project: githubProject,
  post: githubPost,
  addGithub: protectedProcedure.mutation(() => {
    const url = `https://github.com/login/oauth/authorize?client_id=${
      env.GITHUB_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      env.GITHUB_CALLBACK_URL,
    )}&scope=${encodeURIComponent("user repo")}`;
    return { url };
  }),
  // getCommits: protectedProcedure
  //   .input(z.object({ projectId: z.string() }))
  //   .query(async ({ input, ctx }) => {
  //     console.log("input", input);
  //     // const github = await ctx.prisma.githubToken.findMany({
  //     //   where: { clerkUserId: ctx.currentUser },
  //     // });
  //     const github = await ctx.db.query.githubToken.findMany({
  //       where: eq(schema.githubToken.clerkUserId, ctx.currentUser),
  //     });
  //     const githubTokens = await getGithubAccountDetails(github);
  //     // const project = await ctx.prisma.project.findUnique({
  //     //   where: { id: input.projectId },
  //     // });
  //     const project = await ctx.db.query.project.findFirst({
  //       where: eq(schema.project.id, input.projectId),
  //     });
  //     const { getCommits } = useGithub(githubTokens?.at(0)?.accessToken ?? "");
  //     const owner = getUsername(project?.repoUrl ?? "");
  //     const repo = project?.repoName;
  //     if (!owner || !repo) return;

  //     const res = await getCommits(owner, repo);

  //     return {
  //       commits: res,
  //       project,
  //     };
  //   }),
});
