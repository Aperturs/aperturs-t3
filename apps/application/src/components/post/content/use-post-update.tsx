import { useCallback, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { SocialType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";

function usePostUpdate(id: string) {
  const { setContent, content } = useStore(
    (state) => ({
      content: state.content,
      setContent: state.setContent,
    }),
    shallow,
  );

  const [sync, setSync] = useState(false);

  const updateContent = useCallback(
    (newContent: string) => {
      if ((id as SocialType) === SocialType.Default) {
        const updatedContent = content.map((item) =>
          !item.unique || (item.socialType as SocialType) === SocialType.Default
            ? {
                ...item,
                content:
                  (item.socialType as SocialType) === SocialType.Twitter
                    ? [
                        {
                          id: "0",
                          content: newContent,
                          files: [],
                          name: "",
                          socialType: "TWITTER",
                          unique: false,
                          uploadedFiles: [],
                          previewUrls: [],
                        },
                      ]
                    : newContent,
              }
            : item,
        );
        console.log(updatedContent, id);
        setContent(updatedContent);
      } else {
        const updatedContent = content.map((item) =>
          item.id === id
            ? {
                ...item,
                content:
                  item.socialType === "TWITTER"
                    ? [
                        {
                          ...item,
                          content: newContent,
                        },
                      ]
                    : newContent,
              }
            : item,
        );
        setContent(updatedContent);
      }
      console.log(content);
    },
    [content, id, setContent],
  );

  const updateFiles = useCallback(
    (newFiles: File[], previewUrls: string[]) => {
      console.log(newFiles, "from updateFiles");
      if ((id as SocialType) === SocialType.Default) {
        const updatedContent = content.map((item) =>
          !item.unique
            ? { ...item, files: newFiles, previewUrls }
            : (item.id as SocialType) === SocialType.Default
              ? { ...item, files: newFiles, previewUrls }
              : item,
        );
        console.log(updatedContent, "updated");
        setContent(updatedContent);
      } else {
        const updatedContent = content.map((item) =>
          item.id === id ? { ...item, files: newFiles, previewUrls } : item,
        );
        setContent(updatedContent);
      }
      console.log(content, "from updateFiles");
    },
    [content, id, setContent],
  );

  const removeFiles = useCallback(
    (index: number) => {
      if ((id as SocialType) === SocialType.Default) {
        const updatedContent = content.map((item) =>
          !item.unique || (item.socialType as SocialType) === SocialType.Default
            ? {
                ...item,
                files: item.files.filter((_, i) => i !== index) || [],
                previewUrls:
                  item.previewUrls?.filter((_, i) => i !== index) ?? [],
              }
            : item,
        );
        console.log(updatedContent, "from removeFiles");
        setContent(updatedContent);
      } else {
        const updatedContent = content.map((item) =>
          item.id === id
            ? {
                ...item,
                files: item.files.filter((_, i) => i !== index) || [],
                previewUrls:
                  item.previewUrls?.filter((_, i) => i !== index) ?? [],
              }
            : item,
        );
        console.log(updatedContent, "from removeFiles");
        setContent(updatedContent);
      }
    },
    [content, id, setContent],
  );

  const removeUpdatedFiles = useCallback(
    (index: number) => {
      const updatedContent = content.map((item) =>
        item.id === id
          ? {
              ...item,
              uploadedFiles: item.uploadedFiles.filter((_, i) => i !== index),
            }
          : item,
      );
      setContent(updatedContent);
    },
    [content, id, setContent],
  );

  const contentValue = useMemo(() => {
    return content.find((item) => item.id === id)?.content ?? "";
  }, [id, content]) as string;

  const currentFiles = useMemo(() => {
    return content.find((item) => item.id === id)?.uploadedFiles ?? [];
  }, [id, content]);

  return {
    contentValue,
    updateContent,
    updateFiles,
    removeFiles,
    sync,
    setSync,
    currentFiles,
    removeUpdatedFiles,
  };
}

export default usePostUpdate;
