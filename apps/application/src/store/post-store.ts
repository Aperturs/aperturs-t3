import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type {
  FullPostType,
  PostType,
  SocialProviderType,
  youtubeContentType,
} from "@aperturs/validators/post";

interface StateValues {
  date: Date | undefined;
  time: string | null;
  post: FullPostType;
  youtubeContent: youtubeContentType;
  postType: PostType;
  socialProviders: SocialProviderType[];
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
  setSocialProviders: (socialProviders: SocialProviderType[]) => void;
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
        media: [],
        name: "DEFAULT",
        order: 0,
        socialType: "DEFAULT",
        tags: [],
      },
    ],
    alternativeContent: [],
    scheduledTime: undefined,
    orgId: "",
    projectId: "",
    postType: "NORMAL",
  },
  socialProviders: [],
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    ...initialState,
    shouldReset: false,
    setShouldReset: (shouldReset) =>
      set((state) => ({ ...state, shouldReset })),
    setDate: (date) => set((state) => ({ ...state, date })),
    setTime: (time) => set((state) => ({ ...state, time })),
    setPost: (post) => set((state) => ({ ...state, post })),
    setPostType: (postType) => set((state) => ({ ...state, postType })),
    reset: () => set(() => initialState),
    setYoutubeContent: (youtubeContent) =>
      set((state) => ({ ...state, youtubeContent })),
    setSocialProviders: (socialProviders) => set((state) => ({ ...state, socialProviders })),
  }),
  shallow,
);
