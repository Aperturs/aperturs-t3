import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { BsFillImageFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { Popover, PopoverContent, PopoverTrigger } from "@aperturs/ui/popover";
import ToolTipSimple from "@aperturs/ui/tooltip-final";
import { SocialType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import usePostUpdate from "./use-post-update";

function isImage(url: string): boolean {
  const fileExtension = url.split(".");
  const keywords = ["jpg", "jpeg", "png", "gif", "bmp", "image", "unsplash"];

  // Check if any part of the file extension includes the keywords
  return fileExtension.some((part) => keywords.includes(part.toLowerCase()));
}

export default function FileUpload({
  id,
  uploadedFiles,
  postType,
}: {
  id: string;
  postType: SocialType;
  uploadedFiles: string[];
}) {
  const { content } = useStore();
  const filesThatBelongHere = content
    .map((post) => {
      if (post.id === id) return post.files;
    })
    .filter(Boolean)[0];
  const previewUrlsBelongHere = content
    .map((post) => {
      if (post.id === id) return post.previewUrls;
    })
    .filter(Boolean)[0];
  const [selectedFiles, setSelectedFiles] = useState<File[]>(
    filesThatBelongHere ?? [],
  );
  console.log(selectedFiles, "selectedFiles");
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    previewUrlsBelongHere ?? [],
  );
  console.log(previewUrls, "previewUrls from fileUpload");
  const { updateFiles, removeFiles, removeUpdatedFiles } = usePostUpdate(id);
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (selectedFiles.length + uploadedFiles.length >= 4) {
        toast.error("Maximum 4 files allowed");
        return;
      }
      const files = event.target.files;
      if (files && files.length > 0) {
        const newFiles = Array.from(files);

        const contentContainNonUniqueLinkedin = content.some(
          (post) =>
            (post.socialType as SocialType) === SocialType.Linkedin &&
            !post.unique,
        );

        if (
          postType === SocialType.Linkedin ||
          contentContainNonUniqueLinkedin
        ) {
          const isImageSelected = selectedFiles.some((file) =>
            file.type.startsWith("image/"),
          );
          const isVideoSelected = selectedFiles.some((file) =>
            file.type.startsWith("video/"),
          );
          const isNewFileImage = newFiles.some((file) =>
            file.type.startsWith("image/"),
          );
          const isNewFileVideo = newFiles.some((file) =>
            file.type.startsWith("video/"),
          );

          if (
            (isImageSelected && isNewFileVideo) ||
            (isVideoSelected && isNewFileImage)
          ) {
            toast.error(
              "You can't have both image and video at the same time on LinkedIn",
            );
            return;
          }
        }

        const fileSizeExceeded = newFiles.some(
          (file) => file.size > 30 * 1024 * 1024,
        ); // 30MB
        if (fileSizeExceeded) {
          toast.error("Maximum file size is 30MB");
          return;
        }
        const newSelectedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(newSelectedFiles);
        const newPreviewUrls = newFiles.map((file) => {
          const url = URL.createObjectURL(file);
          return url;
        });
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
        updateFiles(newSelectedFiles, newPreviewUrls);
      }
    },

    [postType, previewUrls, selectedFiles, updateFiles, uploadedFiles.length],
  );

  const inputId = `fileInput${id}`;

  const handleRemove = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    removeFiles(index);
  };

  // const removeFromUploaded = (url: string) => {
  //   return "";
  // };

  return (
    <div>
      <div className="flex flex-shrink-0  gap-2 overflow-x-auto">
        {uploadedFiles.map((url, index) => (
          <div
            key={url}
            className="group relative inline flex-shrink-0 cursor-pointer transition ease-in-out"
          >
            {isImage(url) ? (
              <Image
                src={url}
                alt={`File Preview ${url}`}
                style={{ maxWidth: "100%", maxHeight: "150px" }}
                width={150}
                height={250}
              />
            ) : (
              <video controls style={{ maxWidth: "100%", maxHeight: "100px" }}>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
                <track kind="captions" />
              </video>
            )}
            <DeleteImage handleRemove={removeUpdatedFiles} index={index} />
          </div>
        ))}
        {previewUrls.map((url, index) => (
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
        ))}
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
            accept="image/*,video/*"
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
