/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Octokit } from "octokit";
import { useAPICallWrapper } from "./useAPICallWrapper";
type VisibilityType = "all" | "public" | "private" | undefined;

export const useGithub = (token: string) => {
    const {
        isAPICallFailure,
        isAPICallLoading,
        APICallError,
        isAPICallSuccess,
        wrapAPICall,
    } = useAPICallWrapper();

    const octokit = new Octokit({
        auth: token,
    });

    const getRepositories = async (visibility: VisibilityType = "all") => {
        return wrapAPICall(
            async () =>
                await octokit.rest.repos.listForAuthenticatedUser({
                    visibility: visibility,
                    sort: "updated",
                })
        )
    }
    const getRepository = async (owner: string, repo: string) => {
        return wrapAPICall(async () => await octokit.rest.repos.get(
            {
                owner,
                repo
            }
        ))
    }
    const getCommits = async (owner: string, repo: string) => {
        return wrapAPICall(async () => await octokit.rest.repos.listCommits(
            {
                owner,
                repo
            }
        ))
    }
    const getPullRequests = async (owner: string, repo: string, type: "open" | "closed" | "all" = "all") => {
        return wrapAPICall(async () => await octokit.rest.pulls.list({
            owner,
            repo,
            state: type
        }))
    }
    const getPullRequestById = async (owner: string, repo: string, id: number) => {
        return wrapAPICall(async () => await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: id
        }))
    }
    return {
        getRepositories,
        getRepository,
        loading: isAPICallLoading,
        failure: isAPICallFailure,
        error: APICallError,
        success: isAPICallSuccess,
        getCommits,
        getPullRequestById,
        getPullRequests
    }
}