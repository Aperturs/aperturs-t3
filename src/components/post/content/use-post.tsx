import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";

export default function usePost() {
  const { setContent, content } = useStore(
    (state) => ({
      content: state.content,
      setContent: state.setContent,
    }),
    shallow
  );
  const { uploadToS3 } = useS3Upload();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFilesAndModifyContent = async () => {
    const localUploadedFiles: { [key: string]: string } = {};
    setLoading(true);
    console.log("uploading files");

    const updatedContent = await Promise.all(
      content.map(async (post) => {
        console.log("inside promise all", post.files?.length);
        if (post.files && post.files.length > 0) {
          const postUploadedFiles: string[] = post.uploadedFiles
            ? [...post.uploadedFiles]
            : [];
          console.log("inside updatedContent");
          for (const file of post.files) {
            // Check if a similar file has already been uploaded
            if (localUploadedFiles[file.name]) {
              // File already uploaded, use the existing URL
              console.log(
                "pusing existing file",
                localUploadedFiles[file.name] as string
              );
              postUploadedFiles.push(localUploadedFiles[file.name] as string);
            } else {
              // File not uploaded yet, upload it
              const { url } = await uploadToS3(file);
              console.log("pusing new file", url);
              postUploadedFiles.push(url);

              localUploadedFiles[file.name] = url;
            }
          }

          setLoading(false);
          // Update the post with uploaded files and remove the files array
          return {
            ...post,
            uploadedFiles: postUploadedFiles,
            files: [],
          };
        } else {
          // No files to upload, keep the post as is
          return post;
        }
      })
    ).catch((error) => {
      setError(error as Error);
      setLoading(false);
      return content;
    });

    // Update the global state with the modified content
    return updatedContent;
  };

  return {
    uploadFilesAndModifyContent,
    loading,
    error,
  };
}
