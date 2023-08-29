import { Octokit } from "octokit";
import { useState } from "react";
import { useAPICallWrapper } from "./useAPICallWrapper";
type VisibilityType = "all" | "public" | "private" | undefined


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
    })

    const [loading, setLoading] = useState(false);

    const getRepositories = async (visibility: VisibilityType = "all") => {
        return wrapAPICall(async () => await octokit.rest.repos.listForAuthenticatedUser({
            visibility: visibility,
            sort: "updated"
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
    return {
        getRepositories,
        getRepository,
        loading: isAPICallLoading,
        failure: isAPICallFailure,
        error: APICallError,
        success: isAPICallSuccess,
        getCommits
    }
}