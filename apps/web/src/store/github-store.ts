import { create } from "zustand";

import type { CommitType } from "@aperturs/validators/github-store";

interface IGithubStore {
  commits: CommitType[];
  setCommits: (commits: CommitType[]) => void;
}

export const useGithubStore = create<IGithubStore>((set) => ({
  commits: [],
  setCommits: (commits) => set({ commits }),
}));
