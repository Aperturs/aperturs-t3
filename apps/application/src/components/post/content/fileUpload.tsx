import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import Image from "next/image";
import { BsFillImageFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import type { MediaType, SocialType } from "@aperturs/validators/post";
import { Popover, PopoverContent, PopoverTrigger } from "@aperturs/ui/popover";
import ToolTipSimple from "@aperturs/ui/tooltip-final";
import {
  allowedImageMimeTypes,
  allowedImageTypes,
  allowedVideoMimeTypes,
} from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import usePostUpdate from "./use-post-update";

function isImage(url: string): boolean {
  const fileExtension = url.split(".");

  // Check if any part of the file extension includes the keywords
  return fileExtension.some((part) =>
    allowedImageTypes.includes(part.toUpperCase()),
  );
}

// Generate accept string
const imageAcceptString = Array.from(allowedImageMimeTypes).join(",");
const videoAcceptString = Array.from(allowedVideoMimeTypes).join(",");
const acceptString = `${imageAcceptString},${videoAcceptString}`;

export default function FileUpload({
  socialId,
  socialType,
  orderId,
}: {
  socialId?: string;
  socialType: SocialType;
  orderId: number;
}) {
  const { post } = useStore();

  const mediaHere = post?.content.find(
    (content) => content.order === orderId,
  )?.media;

  const [media, SetMedia] = useState<MediaType[]>(mediaHere ?? []);

  const { updateMedia, removeFiles } = usePostUpdate(orderId, socialId);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // if (selectedFiles.length + uploadedFiles.length >= 4) {
      //   toast.error("Maximum 4 files allowed");
      //   return;
      // }
      // const files = event.target.files;
      // if (files && files.length > 0) {
      //   const newFiles = Array.from(files);
      //   // const contentContainNonUniqueLinkedin = content.some(
      //   //   (post) => post.socialType === SocialTypes.LINKEDIN && !post.unique,
      //   // );
      //   if (
      //     postType === SocialTypes.LINKEDIN
      //     //  ||
      //     // contentContainNonUniqueLinkedin
      //   ) {
      //     const isImageSelected = selectedFiles.some((file) =>
      //       file.type.startsWith("image/"),
      //     );
      //     const isVideoSelected = selectedFiles.some((file) =>
      //       file.type.startsWith("video/"),
      //     );
      //     const isNewFileImage = newFiles.some((file) =>
      //       file.type.startsWith("image/"),
      //     );
      //     const isNewFileVideo = newFiles.some((file) =>
      //       file.type.startsWith("video/"),
      //     );
      //     if (
      //       (isImageSelected && isNewFileVideo) ||
      //       (isVideoSelected && isNewFileImage)
      //     ) {
      //       toast.error(
      //         "You can't have both image and video at the same time on LinkedIn",
      //       );
      //       return;
      //     }
      //   }
      //   const fileSizeExceeded = newFiles.some(
      //     (file) => file.size > 30 * 1024 * 1024,
      //   ); // 30MB
      //   if (fileSizeExceeded) {
      //     toast.error("Maximum file size is 30MB");
      //     return;
      //   }
      //   const newSelectedFiles = [...selectedFiles, ...newFiles];
      //   setSelectedFiles(newSelectedFiles);
      //   const newPreviewUrls = newFiles.map((file) => {
      //     const url = URL.createObjectURL(file);
      //     return url;
      //   });
      //   const allURls = [...previewUrls, ...newPreviewUrls];
      //   setPreviewUrls(allURls);
      //   updateFiles(newSelectedFiles, allURls, tweetId);
      // }
    },

    [
      // content,
      // postType,
      // previewUrls,
      // selectedFiles,
      // updateFiles,
      // uploadedFiles.length,
      // tweetId,
    ],
  );

  const inputId = `fileInput${socialId}${orderId}`;

  const handleRemove = (index: number) => {
    // const newSelectedFiles = [...selectedFiles];
    // newSelectedFiles.splice(index, 1);
    // setSelectedFiles(newSelectedFiles);
    // const newPreviewUrls = [...previewUrls];
    // newPreviewUrls.splice(index, 1);
    // setPreviewUrls(newPreviewUrls);
    // removeFiles(index, tweetId);
  };

  // const removeFromUploaded = (url: string) => {
  //   return "";
  // };

  return (
    <div>
      <div className="flex flex-shrink-0  gap-2 overflow-x-auto">
        {media.map((singleMedia, index) => (
          <div
            key={singleMedia.url ?? singleMedia.previewUrl}
            className="group relative inline flex-shrink-0 cursor-pointer transition ease-in-out"
          >
            {singleMedia.mediaType === "IMAGE" &&
            (singleMedia.previewUrl ?? singleMedia.url) ? (
              <Image
                src={singleMedia.previewUrl ?? singleMedia.url ?? ""}
                alt={`File Preview ${singleMedia.url}`}
                style={{ maxWidth: "100%", maxHeight: "150px" }}
                width={150}
                height={250}
              />
            ) : (
              <video controls style={{ maxWidth: "100%", maxHeight: "100px" }}>
                <source
                  src={singleMedia.previewUrl ?? singleMedia.url ?? ""}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
                <track kind="captions" />
              </video>
            )}
            <DeleteImage handleRemove={() => {
              console.log('')
            }} index={index} />
          </div>
        ))}
        {/* {previewUrls.map((url, index) => (
          <div
            key={url}
            className="group relative inline flex-shrink-0 cursor-pointer transition ease-in-out"
          >
            {selectedFiles[index]?.type?.startsWith("image/") ? (
              <Image
                src={url}
                alt={`File Preview ${url}`}
                style={{ maxWidth: "100%", maxHeight: "150px" }}
                width={150}
                height={250}
              />
            ) : (
              <video controls style={{ maxWidth: "100%", maxHeight: "100px" }}>
                <source
                  src={url}
                  type={selectedFiles[index - uploadedFiles.length]?.type}
                />
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            )}
            <DeleteImage handleRemove={handleRemove} index={index} />
          </div>
        ))} */}
      </div>
      <ToolTipSimple content="Add Image/Video">
        <label htmlFor={inputId} className="my-2  block w-8 cursor-pointer">
          {""}
          <BsFillImageFill className="text-xl" />
          <input
            type="file"
            id={inputId}
            className="hidden w-8"
            onChange={handleFileChange}
            accept={acceptString}
          />
        </label>
      </ToolTipSimple>
    </div>
  );
}

interface DeleteImageProps {
  handleRemove: (index: number) => void;
  index: number;
}

function DeleteImage({ handleRemove, index }: DeleteImageProps) {
  const [clickedOnce, setClickedOnce] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (clickedOnce) {
      // If already clicked once, perform the removal
      handleRemove(index);
    } else {
      // If not clicked once, set the state to indicate the first click
      setClickedOnce(true);
    }
  };

  const handleMouseLeave = () => {
    // Reset the state when the mouse leaves, so it goes back to the initial state
    setClickedOnce(false);
    setIsHovered(false);
  };

  return (
    <Popover open={clickedOnce}>
      <PopoverContent className="w-fit py-2 text-xs">
        Click again to Delete
      </PopoverContent>
      <PopoverTrigger
        className={`delay-50 absolute right-1 top-1 z-10  grid place-content-center rounded-2xl bg-secondary p-2  text-sm opacity-0 transition-all duration-100 group-hover:opacity-100`}
      >
        <button
          // size="icon"
          // variant="secondary"
          onClick={handleClick}
          onMouseLeave={handleMouseLeave}
        >
          {clickedOnce ? <FaCheck /> : <MdDelete />}
        </button>
      </PopoverTrigger>
    </Popover>
  );
}
