import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { githubPost } from "./post";
import { githubProject } from "./project";
import { getGithubAccountDetails } from "../../helpers/github";
import { useGithub } from "~/hooks/useGithub";

function getUsername(url: string): string | null {
  const regex = /https:\/\/github\.com\/([^\/]+)\/[^\/]+/;
  const match = url.match(regex);

  if (match && match.length >= 2) {
    return match[1] || null;
  } else {
    return null;
  }
}

export const github = createTRPCRouter({
  project: githubProject,
  post: githubPost,
  addGithub: protectedProcedure.mutation(() => {
    try {
      const url = `https://github.com/login/oauth/authorize?client_id=${
        env.NEXT_PUBLIC_GITHUB_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        env.NEXT_PUBLIC_GITHUB_CALLBACK_URL
      )}&scope=${encodeURIComponent("user repo")}`;
      return { url };
    } catch (error) {
      console.log(error);
    }
  }),
  getCommits: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log("input", input);
      const github = await ctx.prisma.githubToken.findMany({
        where: { clerkUserId: ctx.currentUser },
      });
      const githubTokens = await getGithubAccountDetails(github);
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      });
      const { getCommits } = useGithub(githubTokens?.at(0)?.access_token ?? "");
      const owner = getUsername(project?.repoUrl ?? "");
      const repo = project?.repoName;
      if (!owner || !repo) return;
      const res = await getCommits(owner, repo);

      return {
        commits: res,
        project,
      };
    }),
});
