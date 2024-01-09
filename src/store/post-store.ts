import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type StateValues = {
  defaultContent: string;
  tweets: Tweet[];
  date: Date | null;
  time: string | null;
  content: PostContent[];
};

type StateSetters = {
  shouldReset: boolean;
  setShouldReset: (shouldReset: boolean) => void;
  setDefaultContent: (defaultContent: string) => void;
  setTweets: (tweet: Tweet[]) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  reset: () => void;
  setContent: (content: PostContent[]) => void;
};

type State = StateValues & StateSetters;

const initialState: StateValues = {
  defaultContent: "",
  tweets: [{ id: 0, text: "" }],
  date: null,
  time: "00:00",
  content: [],
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    ...initialState,
    shouldReset: false,
    setShouldReset: (shouldReset) =>
      set((state) => ({ ...state, shouldReset })),
    setDefaultContent: (defaultContent) =>
      set((state) => ({ ...state, defaultContent: defaultContent })),
    setTweets: (tweets) => set((state) => ({ ...state, tweets })),
    setDate: (date) => set((state) => ({ ...state, date })),
    setTime: (time) => set((state) => ({ ...state, time })),
    setContent: (content) => set((state) => ({ ...state, content })),
    reset: () => set(() => initialState),
  }),
  shallow
);
