import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { PostContentType, PostType } from "@aperturs/validators/post";
import { SocialType } from "@aperturs/validators/post";

interface StateValues {
  date: Date | undefined;
  time: string | null;
  content: PostContentType[];
  postType: PostType;
}

interface StateSetters {
  shouldReset: boolean;
  setShouldReset: (shouldReset: boolean) => void;
  setDate: (date: Date | undefined) => void;
  setTime: (time: string | null) => void;
  reset: () => void;
  setContent: (content: PostContentType[]) => void;
  setPostType: (postType: PostType) => void;
}

type State = StateValues & StateSetters;

const initialState: StateValues = {
  postType: "NORMAL",
  date: undefined,
  time: "00:00",
  content: [
    {
      id: SocialType.Default,
      name: "Default",
      socialType: SocialType.Default,
      content: "",
      unique: true,
      files: [],
      uploadedFiles: [],
    },
  ],
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    ...initialState,
    shouldReset: false,
    setShouldReset: (shouldReset) =>
      set((state) => ({ ...state, shouldReset })),
    setDate: (date) => set((state) => ({ ...state, date })),
    setTime: (time) => set((state) => ({ ...state, time })),
    setContent: (content) => set((state) => ({ ...state, content })),
    setPostType: (postType) => set((state) => ({ ...state, postType })),
    reset: () => set(() => initialState),
  }),
  shallow,
);
