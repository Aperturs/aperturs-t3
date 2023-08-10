import { create } from "zustand";
import { SocialType } from "~/types/post-enums";

type StateValues = {
  linkedinPost: string;
  tweets: Tweet[];
  sync: boolean;
  date: Date | null;
  time: string;
  selectedSocials: SelectedSocial[];
  content: PostContent[];
};

type StateSetters = {
  setLinkedinPost: (content: string) => void;
  setTweets: (tweet: Tweet[]) => void;
  setSync: (sync: boolean) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  setSelectedSocials: (selectedSocials: SelectedSocial[]) => void;
  reset: () => void;
  setContent: (content: PostContent[]) => void;
};

type State = StateValues & StateSetters;

const initialState: StateValues = {
  linkedinPost: "",
  tweets: [{ id: 0, text: "" }],
  sync: false,
  date: null,
  time: "00:00",
  selectedSocials: [
    // {
    //   id: 0,
    //   type: SocialType.Twitter,
    //   name: "Twitter",
    // },
    // {
    //   id: 0,
    //   type: SocialType.Lens,
    //   name: "Twitter",
    // },
    // {
    //   id: 0,
    //   type: SocialType.Lens,
    //   name: "Twitter",
    // }
  ],
  content: [
    // {
    //   id: 0,
    //   socialType: SocialType.Default,
    //   content: "",
    //   name: "",
    // }
  ],
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
  setContent: (content) => set((state) => ({ ...state, content })),
  reset: () => set(() => initialState),
}));
