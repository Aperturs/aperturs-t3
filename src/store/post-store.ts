import { create } from "zustand";

type StateValues = {
  defaultContent: string;
  tweets: Tweet[];
  date: Date | null;
  time: string | null;
  selectedSocials: SelectedSocial[];
  content: PostContent[];
};

type StateSetters = {
  shouldReset: boolean;
  setShouldReset: (shouldReset: boolean) => void;
  setDefaultContent: (defaultContent: string) => void;
  setTweets: (tweet: Tweet[]) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  setSelectedSocials: (selectedSocials: SelectedSocial[]) => void;
  reset: () => void;
  setContent: (content: PostContent[]) => void;
};

type State = StateValues & StateSetters;

const initialState: StateValues = {
  defaultContent: "",
  tweets: [{ id: 0, text: "" }],
  date: null,
  time: "00:00",
  selectedSocials: [],
  content: [],
};

export const useStore = create<State>((set) => ({
  ...initialState,
  shouldReset: false,
  setShouldReset: (shouldReset) => set((state) => ({ ...state, shouldReset })),
  setDefaultContent: (defaultContent) =>
    set((state) => ({ ...state, defaultContent: defaultContent })),
  setTweets: (tweets) => set((state) => ({ ...state, tweets })),
  setSelectedSocials: (selectedSocials) =>
    set((state) => ({ ...state, selectedSocials })),
  setDate: (date) => set((state) => ({ ...state, date })),
  setTime: (time) => set((state) => ({ ...state, time })),
  setContent: (content) => set((state) => ({ ...state, content })),
  reset: () => set(() => initialState),
}));
