import { useCallback, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";

function usePostUpdate(id: string) {
  const { setContent, content, setDefaultContent, defaultContent } = useStore(
    (state) => ({
      content: state.content,
      setDefaultContent: state.setDefaultContent,
      defaultContent: state.defaultContent,
      setContent: state.setContent,
    }),
    shallow
  );
  const [sync, setSync] = useState(false);

  const updateContent = useCallback(
    (newContent: string) => {
      if (id === SocialType.Default) {
        setDefaultContent(newContent);
        const updatedContent = content.map((item) =>
          !item.unique ? { ...item, content: newContent } : item
        );
        setContent(updatedContent);
      } else {
        const updatedContent = content.map((item) =>
          item.id === id ? { ...item, content: newContent } : item
        );
        setContent(updatedContent);
      }
    },
    [content, id, setContent, setDefaultContent]
  );

  const updateFiles = useCallback(
    (newFiles: File[]) => {
      if (id === SocialType.Default) {
        const updatedContent = content.map((item) =>
          !item.unique ? { ...item, files: newFiles } : item
        );
        setContent(updatedContent);
      } else {
        const updatedContent = content.map((item) =>
          item.id === id ? { ...item, files: newFiles } : item
        );
        setContent(updatedContent);
      }
    },
    [content, id, setContent]
  );

  const removeFiles = useCallback(
    (index: number) => {
      const updatedContent = content.map((item) =>
        item.id === id
          ? { ...item, files: item.files?.filter((_, i) => i !== index) || [] }
          : item
      );
      setContent(updatedContent);
    },
    [content, id, setContent]
  );

  const contentValue = useMemo(() => {
    return id === SocialType.Default
      ? defaultContent
      : content.find((item) => item.id === id)?.content || "";
  }, [id, content, defaultContent]);

  return {
    contentValue,
    updateContent,
    updateFiles,
    removeFiles,
    sync,
    setSync,
  };
}

export default usePostUpdate;
