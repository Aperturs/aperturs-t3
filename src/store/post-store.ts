import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { SocialType } from "~/types/post-enums";
import { type PostContentType } from "~/types/post-types";

type StateValues = {
  // tweets: Tweet[];
  date: Date | null;
  time: string | null;
  content: PostContentType[];
};

type StateSetters = {
  shouldReset: boolean;
  setShouldReset: (shouldReset: boolean) => void;
  // setTweets: (tweet: Tweet[]) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  reset: () => void;
  setContent: (content: PostContentType[]) => void;
};

type State = StateValues & StateSetters;

const initialState: StateValues = {
  // tweets: [{ id: 0, text: "" }],
  date: null,
  time: "00:00",
  content: [
    {
      id: SocialType.Default,
      name: "Default",
      socialType: SocialType.Default,
      content: "",
      unique: true,
      files: [],
    },
  ],
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    ...initialState,
    shouldReset: false,
    setShouldReset: (shouldReset) =>
      set((state) => ({ ...state, shouldReset })),
    // setTweets: (tweets) => set((state) => ({ ...state, tweets })),
    setDate: (date) => set((state) => ({ ...state, date })),
    setTime: (time) => set((state) => ({ ...state, time })),
    setContent: (content) => set((state) => ({ ...state, content })),
    reset: () => set(() => initialState),
  }),
  shallow
);
