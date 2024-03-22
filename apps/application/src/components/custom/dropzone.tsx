import React, { useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

import { Card, CardContent } from "@aperturs/ui/card";
import { cn } from "@aperturs/ui/lib/utils";

// Define the props expected by the Dropzone component
interface DropzoneProps {
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  fileExtension?: string;
  explaination?: string;
  icon?: React.ReactNode;
  id?: string;
  onChangeFile?: React.Dispatch<React.SetStateAction<File[]>>;
}

// Create the Dropzone component receiving props
export function Dropzone({
  onChange,
  className,
  fileExtension,
  explaination,
  icon,
  id,
  onChangeFile,
  ...props
}: DropzoneProps) {
  // Initialize state variables using the useState hook
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input element
  const [fileInfo, setFileInfo] = useState<string | null>(null); // Information about the uploaded file
  const [error, setError] = useState<string | null>(null); // Error message state

  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Function to handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  // Function to handle file input change event
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  // Function to handle processing of uploaded files
  const handleFiles = (files: FileList) => {
    const uploadedFile = files[0];

    if (!uploadedFile) return;

    const fileSizeInKB = Math.round(uploadedFile.size / 1024); // Convert to KB

    onChangeFile && onChangeFile(Array.from(files));
    const fileList = Array.from(files).map((file) => URL.createObjectURL(file));
    onChange((prevFiles) => [...prevFiles, ...fileList]);

    // Display file information
    setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
    setError(null); // Reset error state
  };

  // Function to simulate a click on the file input element
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.log("File input reference is null");
    }
  };

  return (
    <>
      <Card
        className={cn(
          `flex items-center justify-center bg-muted py-6 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800`,
          className,
        )}
        {...props}
        onChange={handleButtonClick}
      >
        <label
          htmlFor={id ?? "fileupload"}
          className="flex  h-full w-full cursor-pointer items-center justify-center"
        >
          <CardContent onDragOver={handleDragOver} onDrop={handleDrop}>
            {/* <label htmlFor="file" className="text-muted-foreground"> */}
            <div className=" text-center">
              <div className="mx-auto max-w-min rounded-md border border-gray-900 p-2 dark:border-gray-300">
                {!icon ? (
                  <IoCloudUploadOutline
                    size="1.6em"
                    className="text-black dark:text-white "
                  />
                ) : (
                  icon
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Drag your file</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                {!explaination ? "Click to upload" : explaination}
              </p>
            </div>
            <div className="flex items-center justify-center text-muted-foreground">
              <input
                ref={fileInputRef}
                type="file"
                accept={`${fileExtension}`} // Set accepted file type
                onChange={handleFileInputChange}
                className="hidden"
                multiple
                id={id ?? "fileupload"}
              />
            </div>

            {/* {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>} */}
            {error && <span className="text-red-500">{error}</span>}
          </CardContent>
        </label>
      </Card>
    </>
  );
}
