import { create } from "zustand";



interface IGithubStore {
  commits: ICommit[];
  setCommits: (commits: ICommit[]) => void;
}

export const useGithubStore = create<IGithubStore>((set) => ({
  commits: [],
  setCommits: (commits) => set({ commits }),
}));
