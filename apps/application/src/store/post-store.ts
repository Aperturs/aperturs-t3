import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type {
  PostContentType,
  PostType,
  youtubeContentType,
} from "@aperturs/validators/post";
import { SocialType } from "@aperturs/validators/post";

interface StateValues {
  date: Date | undefined;
  time: string | null;
  content: PostContentType[];
  youtubeContent: youtubeContentType;
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
  setYoutubeContent: (youtubeContent: youtubeContentType) => void;
}

type State = StateValues & StateSetters;

const initialState: StateValues = {
  postType: "NORMAL",
  date: undefined,
  time: "00:00",
  youtubeContent: {
    youtubeId: "",
    name: "",
    thumbnail: "",
    videoDescription: "",
    videoTags: [],
    videoTitle: "",
    videoUrl: "",
  },
  content: [
    {
      id: SocialType.Default,
      name: "Default",
      socialType: SocialType.Default,
      content: "",
      unique: true,
      files: [],
      uploadedFiles: [],
      previewUrls: [],
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
    setYoutubeContent: (youtubeContent) =>
      set((state) => ({ ...state, youtubeContent })),
  }),
  shallow,
);
