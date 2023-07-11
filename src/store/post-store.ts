// store.ts
import {create} from 'zustand'

type Tweet = {
    id:number,
    text:string
}

type State = {
  linkedinPost: string;
  tweets: Tweet[];
  sync: boolean;
  date: Date | null;
  time: string;
  setLinkedinPost: (content: string) => void;
  setTweets: (tweet: Tweet[]) => void;
  setSync: (sync: boolean) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
};

export const useStore = create<State>(set => ({
  linkedinPost: "",
  tweets: [
    {
        id:0,
        text:''
    }
  ],
  sync: false,
  date: null,
  time: '00:00',
  setLinkedinPost: (content) => set((state) => ({ ...state, linkedinPost: content })),
  setTweets: (tweets) => set((state) => ({ ...state, tweets: tweets })),
  setSync: (sync) => set((state) => ({ ...state, sync: sync })),
  setDate: (date) => set((state) => ({ ...state, date: date })),
  setTime: (time) => set((state) => ({ ...state, time: time }))
}));

