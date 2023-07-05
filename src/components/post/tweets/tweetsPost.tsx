import React, { useContext, useState } from "react";
import SingleTweet from "./singleTweet";
import { Card } from "@material-tailwind/react";
import { PostContext } from "../postWrapper";

type Tweet = {
  id: number;
  text: string;
};

const TweetPost: React.FC = () => {

  const {tweets,setTweets} = useContext(PostContext)

  const handleAddTweet = () => {
    const newId = tweets.length;
    setTweets([...tweets, { id: newId, text: "" }]);
  };

  const handleRemoveTweet = (id: number) => {
    const updatedTweets = tweets.filter((tweet) => tweet.id !== id);
    setTweets(updatedTweets);
  };

  const handleTweetChange = (id: number, newText: string) => {
    const updatedTweets = tweets.map((tweet) =>
      tweet.id === id ? { ...tweet, text: newText } : tweet
    );
    setTweets(updatedTweets);
  };

  const handlePost = () => {
    console.log(tweets);
  };

  return (
    <Card className=" p-4">
      <div>
        {tweets.map((tweet) => (
          <SingleTweet
            key={tweet.id}
            id={tweet.id}
            text={tweet.text}
            onChange={handleTweetChange}
            onRemove={handleRemoveTweet}
          />
        ))}
        <button
          className="rounded-full bg-accent px-4 py-2 text-white"
          onClick={handleAddTweet}
        >
          +
        </button>
      </div>
    </Card>
  );
};

export default TweetPost;
