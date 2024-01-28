import Image from "next/image";
import { useCallback, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import usePostUpdate from "./handleContent";

export default function FileUpload({ id }: { id: string }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { updateFiles, removeFiles } = usePostUpdate(id);

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
          const reader = new FileReader();
          reader.readAsDataURL(file);
          return new Promise<string>((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
          });
        });

        void Promise.all(newPreviewUrls).then((urls) => {
          setPreviewUrls([...previewUrls, ...urls]);
          updateFiles(newFiles);
        });
      }
    },
    [previewUrls, selectedFiles, updateFiles]
  );

  // ...

  const handleRemove = useCallback(
    (index: number) => {
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(index, 1);
      setSelectedFiles(newSelectedFiles);
      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
      removeFiles(index);
    },
    [previewUrls, removeFiles, selectedFiles]
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto">
        {previewUrls.map((url, index) => (
          <div key={url} className="group relative cursor-pointer">
            {selectedFiles[index]?.type?.startsWith("image/") ? (
              <Image
                src={url}
                alt={`File Preview ${index + 1}`}
                style={{ maxWidth: "100%", maxHeight: "100px" }}
                width={100}
                height={100}
              />
            ) : (
              <video controls style={{ maxWidth: "100%", maxHeight: "100px" }}>
                <source src={url} type={selectedFiles[index]?.type} />
                Your browser does not support the video tag.
              </video>
            )}
            <button
              className="absolute right-0 top-0 z-10 hidden place-content-center p-1 text-xl  text-red-400 transition-all ease-in-out group-hover:grid"
              onClick={() => handleRemove(index)}
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </div>
      <label htmlFor="fileInput" className="my-2 block w-fit cursor-pointer">
        <input
          type="file"
          id="fileInput"
          className="hidden w-14"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
        />
        <FaCamera className="text-xl" />
      </label>
    </div>
  );
}
