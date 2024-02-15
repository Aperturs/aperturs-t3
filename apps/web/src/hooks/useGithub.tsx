/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Octokit } from "octokit";
type VisibilityType = "all" | "public" | "private" | undefined;

export const useGithub = (token: string) => {
  const octokit = new Octokit({
    auth: token,
  });

  const getRepositories = async (visibility: VisibilityType = "all") => {
    return await octokit.rest.repos.listForAuthenticatedUser({
      visibility: visibility,
      sort: "updated",
    });
  };
  const getRepository = async (owner: string, repo: string) => {
    return await octokit.rest.repos.get({
      owner,
      repo,
    });
  };
  const getCommits = async (owner: string, repo: string) => {
    return await octokit.rest.repos.listCommits({
      owner,
      repo,
    });
  };
  const getPullRequests = async (
    owner: string,
    repo: string,
    type: "open" | "closed" | "all" = "all",
  ) => {
    return await octokit.rest.pulls.list({
      owner,
      repo,
      state: type,
    });
  };
  const getPullRequestById = async (
    owner: string,
    repo: string,
    id: number,
  ) => {
    return await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: id,
    });
  };
  return {
    getRepositories,
    getRepository,
    getCommits,
    getPullRequestById,
    getPullRequests,
  };
};
