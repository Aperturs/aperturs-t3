import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import type { BasePostContentType } from "@aperturs/validators/post";
import { Card } from "@aperturs/ui/card";

import { useDebounce } from "~/hooks/useDebounce";
import { useStore } from "~/store/post-store";
import { tweetsHere } from "../common";
import FileUpload from "../content/fileUpload";
import SingleTweet from "./singleTweet";

function TweetPost({ contentId }: { contentId: string }) {
  // const tweets = useStore(state => state.tweets);
  // const setTweets = useStore(state => state.setTweets);

  const { content, setContent } = useStore(
    (state) => ({
      content: state.content,
      setContent: state.setContent,
    }),
    shallow,
  );

  const tweetsAll = tweetsHere(content, contentId);

  const [tweets, setTweets] = useState(tweetsAll);

  const debouncedTweet = useDebounce(tweets, 1000);

  useEffect(() => {
    const newContent = content.map((item) =>
      item.id === contentId ? { ...item, content: tweets } : item,
    );
    setContent(newContent);
  }, [debouncedTweet]);

  const handleAddTweet = (id: number) => {
    const index = tweets.findIndex((tweet) => parseInt(tweet.id) === id);
    // Increment ids of all tweets after the current one
    const updatedTweets = tweets.map((tweet) => {
      if (parseInt(tweet.id) > id) {
        return { ...tweet, id: tweet.id + 1 };
      }
      return tweet;
    });

    // Create new tweet with id incremented by 1 and an empty text field
    const newTweet = {
      id: (id + 1).toString(),
      content: "",
      files: [],
      name: "",
      socialType: "TWITTER",
      unique: false,
      uploadedFiles: [],
      previewUrls: [],
    } as BasePostContentType;

    // Insert the new tweet after the current one
    updatedTweets.splice(index + 1, 0, newTweet);
    setTweets(updatedTweets);
  };

  const handleRemoveTweet = (id: number) => {
    if (id == 0) return;
    const updatedTweets = tweets.filter((tweet) => parseInt(tweet.id) !== id);
    setTweets(updatedTweets);
    const newContent = content.map((item) =>
      item.id === contentId ? { ...item, content: updatedTweets } : item,
    );
    setContent(newContent);
  };

  const handleTweetChange = (id: number, newText: string) => {
    const updatedTweets = tweets.map((tweet) =>
      parseInt(tweet.id) === id ? { ...tweet, content: newText } : tweet,
    );
    console.log(updatedTweets, "updatedTweets");
    setTweets(updatedTweets);
    const newContent = content.map((item) =>
      item.id === contentId ? { ...item, content: updatedTweets } : item,
    );
    setContent(newContent);
  };

  return (
    <Card className="p-4">
      <div>
        {tweets.map((tweet) => (
          <>
            <SingleTweet
              key={tweet.id}
              id={parseInt(tweet.id)}
              text={tweet.content}
              onChange={handleTweetChange}
              onRemove={handleRemoveTweet}
              onAdd={handleAddTweet}
            />
            <FileUpload
              id={contentId}
              postType="TWITTER"
              uploadedFiles={tweet.uploadedFiles}
              key={tweet.id}
              tweetId={tweet.id}
            />
          </>
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
}

export default TweetPost;
