import SideBar from "./sidebar/sidebar";
import SocialTabs from "./tabs/socialtabs";

// export const PostContext = createContext({
//   // linkedinPost: "",
//   // tweets: [
//   //   {
//   //     id: 1,
//   //     text: "",
//   //   },
//   // ],
//   // setLinkedinPost: (content: string) => {},
//   // setTweets: (tweet: Tweet[]) => {},
//   // sync: false,
//   // setSync: (sync: boolean) => {},
//   date: new Date() ,
//   setDate: (date: Date) => {},
//   time: new Date().getTime(),
//   setTime: (time: number) => {},
// });

function PostView({ id }: { id: number; }) {
  // const [linkedinPost, setLinkedinPost] = useState("");
  // const [tweets, setTweets] = useState<Tweet[]>([
  //   { id: 0,text: " " },
  //   // { id: 0, content: "Hello World" },
  //   // { id: 1, content: "Hello React" },
  // ]);
  // const [sync, setSync] = useState(false);

  // const {setLinkedinPost} = useStore(state => ({
  //   setLinkedinPost: state.setLinkedinPost,
  // }))

  // // const [date, setDate] = useState<Date>(new Date());
  // // const [time, setTime] = useState(new Date().getTime());

  // useEffect(() => {
  //   setLinkedinPost(value)
  // }, []);
  return (
    // <PostContext.Provider
    //   value={{
    //     // linkedinPost,
    //     // tweets,
    //     // setLinkedinPost,
    //     // setTweets,
    //     // sync,
    //     // setSync,
    //     // date,
    //     // setDate,
    //     // time,
    //     // setTime,
    //   }}
    // >
    <div className="flex  justify-center gap-5">
      <SocialTabs />
      <div className="mt-[-6rem] w-full lg:max-w-[18rem]">
        <SideBar />
      </div>
    </div>
    // </PostContext.Provider>
  );
}

export default PostView;
