// store.ts
import { create } from "zustand";
import { SelectedSocial, Tweet } from "~/types/post-types";

type StateValues = {
  linkedinPost: string;
  tweets: Tweet[];
  sync: boolean;
  date: Date | null;
  time: string;
  selectedSocials: SelectedSocial[];
};

type StateSetters = {
  setLinkedinPost: (content: string) => void;
  setTweets: (tweet: Tweet[]) => void;
  setSync: (sync: boolean) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  setSelectedSocials: (selectedSocials: SelectedSocial[]) => void;
  reset: () => void;
};

type State = StateValues & StateSetters;

const initialState: StateValues = {
  linkedinPost: "",
  tweets: [{ id: 0, text: "" }],
  sync: false,
  date: null,
  time: "00:00",
  selectedSocials: [],
};

export const useStore = create<State>((set) => ({
  ...initialState,
  setLinkedinPost: (content) =>
    set((state) => ({ ...state, linkedinPost: content })),
  setTweets: (tweets) => set((state) => ({ ...state, tweets })),
  setSelectedSocials: (selectedSocials) =>
    set((state) => ({ ...state, selectedSocials })),
  setSync: (sync) => set((state) => ({ ...state, sync })),
  setDate: (date) => set((state) => ({ ...state, date })),
  setTime: (time) => set((state) => ({ ...state, time })),
  reset: () => set(() => initialState),
}));
