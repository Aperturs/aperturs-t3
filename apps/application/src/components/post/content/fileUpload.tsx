import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
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
// const acceptString = `${imageAcceptString},${videoAcceptString}`;
const acceptString = `${imageAcceptString}`;

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

  const { updateMedia, removeFiles, mediaValue } = usePostUpdate(
    orderId,
    socialId,
  );
  const [media, SetMedia] = useState<MediaType[]>(mediaValue ?? []);

  console.log(socialId, orderId, mediaValue);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      const newFiles = Array.from(files);
      // Perform file validations
      const isValidFileSize = newFiles.every(
        (file) => file.size <= 30 * 1024 * 1024,
      ); // 30MB limit
      if (!isValidFileSize) {
        // Show error toast
        toast.error("Maximum file size is 30MB");
        return;
      }

      const isValidType = newFiles.every((file) =>
        [...allowedImageMimeTypes, ...allowedVideoMimeTypes].includes(
          file.type,
        ),
      );
      if (!isValidType) {
        // Show error toast
        toast.error("Invalid file type");
        return;
      }

      if (newFiles.length + media.length > 4) {
        // Show error toast
        toast.error("Maximum of 4 files allowed");
        return;
      }

      // Update state with new files
      const newMedia = newFiles.map((file) => ({
        mediaType: file.type.startsWith("image/") ? "IMAGE" : "VIDEO",
        previewUrl: URL.createObjectURL(file),
        file,
      })) as MediaType[];

      const updatedMedia = [...media, ...newMedia];
      SetMedia(updatedMedia);

      // Update the post with new media
      updateMedia(updatedMedia);
    },
    [media, updateMedia],
  );

  const inputId = `fileInput${socialId}${orderId}`;

  const handleRemove = (index: number) => {
    // Create a new array without the removed media
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);

    // Update the state and post
    SetMedia(updatedMedia);
    removeFiles(index); // This function should update the post-store to reflect the removal
  };

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
            <DeleteImage handleRemove={handleRemove} index={index} />
          </div>
        ))}
      </div>
      <ToolTipSimple content="Add Image (videos not supported at the moment)">
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
