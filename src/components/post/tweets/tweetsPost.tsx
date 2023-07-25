import { Card } from "@material-tailwind/react";
import React from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import SingleTweet from "./singleTweet";

const TweetPost: React.FC = () => {
  // const {tweets,setTweets} = useContext(PostContext)
  // const tweets = useStore(state => state.tweets);
  // const setTweets = useStore(state => state.setTweets);

  const { tweets, setTweets } = useStore(
    (state) => ({
      tweets: state.tweets,
      setTweets: state.setTweets,
    }),
    shallow
  );

  const handleAddTweet = (id: number) => {
    const index = tweets.findIndex((tweet) => tweet.id === id);

    // Increment ids of all tweets after the current one
    const updatedTweets = tweets.map((tweet) => {
      if (tweet.id > id) {
        return { ...tweet, id: tweet.id + 1 };
      }
      return tweet;
    });

    // Create new tweet with id incremented by 1 and an empty text field
    const newTweet = { id: id + 1, text: "" };

    // Insert the new tweet after the current one
    updatedTweets.splice(index + 1, 0, newTweet);

    setTweets(updatedTweets);
  };
  const handleRemoveTweet = (id: number) => {
    if (id == 0) return;
    const updatedTweets = tweets.filter((tweet) => tweet.id !== id);
    setTweets(updatedTweets);
  };

  const handleTweetChange = (id: number, newText: string) => {
    const updatedTweets = tweets.map((tweet) =>
      tweet.id === id ? { ...tweet, text: newText } : tweet
    );
    setTweets(updatedTweets);
  };

  return (
    <Card className="p-4">
      <div>
        {tweets.map((tweet) => (
          <SingleTweet
            key={tweet.id}
            id={tweet.id}
            text={tweet.text}
            onChange={handleTweetChange}
            onRemove={handleRemoveTweet}
            onAdd={handleAddTweet}
          />
        ))}
        {/* <button
          className="rounded-full bg-accent px-4 py-2 text-white"
          onClick={handleAddTweet}
        >
          +
        </button> */}
      </div>
    </Card>
  );
};

export default TweetPost;
