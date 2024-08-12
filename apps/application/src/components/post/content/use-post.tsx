import { useMemo, useState } from "react";
import { useS3Upload } from "next-s3-upload";
import { shallow } from "zustand/shallow";

import type { SocialProviderType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";

export default function usePost() {
  const { setPost, post, socialProviders } = useStore(
    (state) => ({
      post: state.post,
      setPost: state.setPost,
      socialProviders: state.socialProviders,
    }),
    shallow,
  );
  const { uploadToS3 } = useS3Upload();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFilesAndModifyContent = async () => {
    // const localUploadedFiles: Record<string, string> = {};
    // setLoading(true);
    // console.log("uploading files");
    // const updatedContent = [];
    // console.log("content inside upload files", content);
    // for (const post of content) {
    //   console.log("inside for loop", post);
    //   if (post.socialType === "TWITTER") {
    //     const tweets = tweetsHere(content, post.id);
    //     const updatedTweets = [];
    //     for (const tweet of tweets) {
    //       if (tweet.files && tweet.files.length > 0) {
    //         const tweetUploadedFiles: string[] = tweet.uploadedFiles
    //           ? [...tweet.uploadedFiles]
    //           : [];
    //         for (const file of tweet.files) {
    //           const fileName = file.name;
    //           if (!localUploadedFiles[fileName]) {
    //             console.log("uploading twitter file", file.name);
    //             const { url } = await uploadToS3(file);
    //             tweetUploadedFiles.push(url);
    //             localUploadedFiles[fileName] = url;
    //           } else {
    //             tweetUploadedFiles.push(localUploadedFiles[fileName]!);
    //           }
    //         }
    //         setLoading(false);
    //         updatedTweets.push({
    //           ...tweet,
    //           uploadedFiles: tweetUploadedFiles,
    //           files: [],
    //           previewUrls: [],
    //         });
    //       } else {
    //         updatedTweets.push(tweet);
    //       }
    //     }
    //     updatedContent.push({
    //       ...post,
    //       content: updatedTweets,
    //     });
    //   } else {
    //     if (post.files && post.files.length > 0) {
    //       const postUploadedFiles: string[] = post.uploadedFiles
    //         ? [...post.uploadedFiles]
    //         : [];
    //       console.log("inside updatedContent");
    //       for (const file of post.files) {
    //         // Check if a similar file has already been uploaded
    //         const fileName = file.name;
    //         if (!localUploadedFiles[fileName]) {
    //           // File not uploaded yet, upload it
    //           const { url } = await uploadToS3(file);
    //           console.log("pusing new file", url);
    //           postUploadedFiles.push(url);
    //           localUploadedFiles[fileName] = url;
    //           console.log("localUploadedFiles", localUploadedFiles);
    //         } else {
    //           // File already uploaded, use the existing URL
    //           console.log(
    //             "pusing existing file",
    //             localUploadedFiles[fileName]!,
    //           );
    //           postUploadedFiles.push(localUploadedFiles[fileName]!);
    //         }
    //       }

    //       setLoading(false);
    //       // Update the post with uploaded files and remove the files array
    //       updatedContent.push({
    //         ...post,
    //         uploadedFiles: postUploadedFiles,
    //         files: [],
    //       });
    //     } else {
    //       // No files to upload, keep the post as is
    //       updatedContent.push(post);
    //     }
    //   }
    // }
    // setLoading(false);
    return post;
  };

  const getValidAlternativeContent = useMemo(() => {
    return post.alternativeContent.filter((provider) =>
      socialProviders.some(
        (sp) => sp.socialId === provider.socialProvider.socialId,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.alternativeContent.length, socialProviders.length]);

  const getSocialTypeOfContent = useMemo(() => {
    const usedSocialIds = new Set(
      getValidAlternativeContent.map((ac) => ac.socialProvider.socialId),
    );
    const availableSocialProviders = socialProviders.filter(
      (provider) => !usedSocialIds.has(provider.socialId),
    );

    if (availableSocialProviders.length === 1 && availableSocialProviders[0]) {
      return availableSocialProviders[0];
    } else {
      return {
        socialId: "DEFAULT",
        name: "DEFAULT",
        socialType: "DEFAULT",
      } as SocialProviderType;
    }
  }, [getValidAlternativeContent, socialProviders]);

  return {
    uploadFilesAndModifyContent,
    loading,
    error,
    getValidAlternativeContent,
    getSocialTypeOfContent,
  };
}
