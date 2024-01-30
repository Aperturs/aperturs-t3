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
      uploadedFiles: [
        "https://images.unsplash.com/photo-1706313296876-ba53e6c1670b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1706498133899-f1cf5a6af53e?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
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
