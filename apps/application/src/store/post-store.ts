import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type {
  FullPostType,
  PostType,
  youtubeContentType,
} from "@aperturs/validators/post";

interface StateValues {
  date: Date | undefined;
  time: string | null;
  post: FullPostType;
  youtubeContent: youtubeContentType;
  postType: PostType;
}

interface StateSetters {
  shouldReset: boolean;
  setShouldReset: (shouldReset: boolean) => void;
  setDate: (date: Date | undefined) => void;
  setTime: (time: string | null) => void;
  reset: () => void;
  setPost: (post: FullPostType) => void;
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
  post: {
    id: "",
    content: [
      {
        text: "",
        files: [],
        media: [],
        name: "DEFAULT",
        order: 0,
        socialType: "DEFAULT",
        uploadedFiles: [],
        previewUrls: [],
        tags: [],
      },
    ],
    alternativeContent: [],
    socialProviders: [],
    scheduledTime: undefined,
    orgId: "",
    projectId: "",
    postType: "NORMAL",
  },
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    ...initialState,
    shouldReset: false,
    setShouldReset: (shouldReset) =>
      set((state) => ({ ...state, shouldReset })),
    setDate: (date) => set((state) => ({ ...state, date })),
    setTime: (time) => set((state) => ({ ...state, time })),
    setPost: (content) => set((state) => ({ ...state, content })),
    setPostType: (postType) => set((state) => ({ ...state, postType })),
    reset: () => set(() => initialState),
    setYoutubeContent: (youtubeContent) =>
      set((state) => ({ ...state, youtubeContent })),
  }),
  shallow,
);
