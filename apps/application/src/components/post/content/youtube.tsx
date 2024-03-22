/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState } from "react";
import Image from "next/image";
import { shallow } from "zustand/shallow";

import type { Tag } from "@aperturs/ui/tag-input";
import { Button } from "@aperturs/ui/button";
import { Input } from "@aperturs/ui/input";
import { Label } from "@aperturs/ui/label";
import { TagInput } from "@aperturs/ui/tag-input";
import { Textarea } from "@aperturs/ui/textarea";

import { Dropzone } from "~/components/custom/dropzone";
import { useStore } from "~/store/post-store";

export default function Youtube() {
  const { setYoutubeContent, youtubeContent } = useStore(
    (state) => ({
      youtubeContent: state.youtubeContent,
      setYoutubeContent: state.setYoutubeContent,
    }),
    shallow,
  );
  const [video, setVideo] = useState<string[]>([youtubeContent.videoUrl]);
  const [thumbnail, setThumbnail] = useState<string[]>([
    youtubeContent.thumbnail,
  ]);
  const [tags, setTags] = useState<Tag[]>(
    youtubeContent.videoTags.map((tag) => ({ text: tag, id: tag })),
  );
  const [videoFile, setVideoFile] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File[]>([]);

  useEffect(() => {
    const videotags = tags.map((tag) => tag.text);

    setYoutubeContent({
      ...youtubeContent,
      videoUrl: video[0] ?? "",
      thumbnail: thumbnail[0] ?? "",
      videoTags: videotags,
      videoFile: videoFile[0] ?? undefined,
      thumbnailFile: thumbnailFile[0] ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video, thumbnail, tags]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {video.length > 0 ? (
            <div className="flex max-w-[50%] flex-col gap-2">
              <video
                src={video[0]}
                className="aspect-video w-full  object-cover"
                controls
              />
              <Button
                onClick={() => {
                  setVideo([]);
                }}
                variant="destructive"
              >
                Remove Video
              </Button>
            </div>
          ) : (
            <>
              <Dropzone
                onChange={setVideo}
                onChangeFile={setVideoFile}
                fileExtension="video/*"
                explaination="Upload a video to be posted on youtube"
                className="aspect-video w-full"
                id={"video"}
              />
            </>
          )}
          {thumbnail.length > 0 ? (
            <div className="flex max-w-[50%] flex-col gap-2">
              <Image
                src={thumbnail[0] ?? ""}
                alt="thumbnail"
                width={300}
                height={200}
                className="aspect-video w-full  rounded-lg object-cover"
              />
              <Button
                onClick={() => {
                  setThumbnail([]);
                }}
                variant="destructive"
              >
                Remove Thumbnail
              </Button>
            </div>
          ) : (
            <Dropzone
              onChange={setThumbnail}
              onChangeFile={setThumbnailFile}
              fileExtension="image/*"
              explaination="Upload a thumbnail for the video to be posted on youtube"
              id="thumbnail"
              className="aspect-video w-full"
            />
          )}
        </div>
        <h2 className="text-lg font-semibold">Add Video Details</h2>
        <>
          <Label htmlFor="video-title">Enter Video Title</Label>
          <Input
            placeholder="Video about socail media"
            id="video-title"
            className="w-full"
            value={youtubeContent.videoTitle}
            onChange={(e) => {
              setYoutubeContent({
                ...youtubeContent,
                videoTitle: e.target.value,
              });
            }}
          />
        </>
        <>
          <Label htmlFor="video-description">Enter Video Description</Label>
          <Textarea
            placeholder="Video description"
            id="video-description"
            className="min-h-36 w-full"
            value={youtubeContent.videoDescription}
            onChange={(e) => {
              setYoutubeContent({
                ...youtubeContent,
                videoDescription: e.target.value,
              });
            }}
          />
        </>
        <>
          {/* <Label htmlFor="video-tags">Enter Video Tags</Label> */}
          <TagInput
            tags={tags}
            setTags={setTags}
            placeholder="Add tags for the video"
            id="video-tags"
          />
        </>
      </div>
    </>
  );
}
