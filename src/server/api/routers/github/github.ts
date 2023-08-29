import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { githubProject } from "./project";

export const github = createTRPCRouter({

project: githubProject,
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

});
