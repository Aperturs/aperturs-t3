import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // Set the selected files
      const newFiles = Array.from(files);
      setSelectedFiles([...selectedFiles, ...newFiles]);

      // Create a FileReader for each file to generate a preview
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
      });
    }
  };

  const handleRemove = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

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
              className="absolute right-0 top-0 z-10 hidden place-content-center bg-opacity-25  p-1 text-xl  text-white transition-all ease-in-out group-hover:grid"
              onClick={() => handleRemove(index)}
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </div>
      <label htmlFor="fileInput" className="cursor-pointer">
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
        />
        <FaCamera />
      </label>
    </div>
  );
}
