import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import { useCallback, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { BsFillImageFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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
}: {
  id: string;
  uploadedFiles: string[];
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { updateFiles, removeFiles, removeUpdatedFiles } = usePostUpdate(id);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const newFiles = Array.from(files);
        const fileSizeExceeded = newFiles.some(
          (file) => file.size > 50 * 1024 * 1024
        ); // 30MB
        if (fileSizeExceeded) {
          toast.error("Maximum file size is 50MB");
          return;
        }
        setSelectedFiles([...selectedFiles, ...newFiles]);
        const newPreviewUrls = newFiles.map((file) => {
          const url = URL.createObjectURL(file);
          return url;
        });
        void Promise.all(newPreviewUrls).then((urls) => {
          setPreviewUrls([...previewUrls, ...urls]);
        });
        updateFiles(newFiles);
      }
    },

    [previewUrls, selectedFiles, updateFiles]
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
                Your browser does not support the video tag.
              </video>
            )}
            <DeleteImage handleRemove={handleRemove} index={index} />
          </div>
        ))}
      </div>
      <Tooltip placement="top" content="Add Image/Video">
        <label htmlFor={inputId} className="my-2  block w-8 cursor-pointer">
          <input
            type="file"
            id={inputId}
            className="hidden w-8"
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <BsFillImageFill className="text-xl" />
        </label>
      </Tooltip>
    </div>
  );
}

interface DeleteImageProps {
  handleRemove: (index: number) => void;
  index: number;
}

function DeleteImage({ handleRemove, index }: DeleteImageProps) {
  const [clickedOnce, setClickedOnce] = useState(false);

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
  };

  return (
    <Tooltip
      placement="top"
      content={clickedOnce ? "Click again to remove" : "Remove"}
    >
      <button
        className={`absolute right-1 top-1 z-10 grid  place-content-center rounded-2xl bg-blue-gray-800 p-2 text-sm ${
          clickedOnce ? " text-yellow-700" : " text-red-700"
        } opacity-0 transition-all delay-100 duration-100 group-hover:opacity-100`}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
      >
        {clickedOnce ? <FaCheck /> : <MdDelete />}
      </button>
    </Tooltip>
  );
}
