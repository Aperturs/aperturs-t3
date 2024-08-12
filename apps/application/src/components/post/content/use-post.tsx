import { useMemo, useState } from "react";
import { useS3Upload } from "next-s3-upload";
import { shallow } from "zustand/shallow";

import type {
  AlternativeContentType,
  ContentType,
  MediaType,
  SocialProviderType,
} from "@aperturs/validators/post";

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

  function cleanFileName(fileName: string): string {
    // Extract the file extension
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);

    // Extract the base name without the extension
    const baseName = fileName.substring(0, fileName.lastIndexOf("."));

    // Clean the base name
    const cleanedBaseName = baseName
      .toLowerCase() // Convert to lowercase
      .trim() // Trim whitespace
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, ""); // Remove any non-alphanumeric characters except for dashes

    // Combine the cleaned base name with the original file extension
    return `${cleanedBaseName}.${fileExtension}`;
  }

  // const uploadFilesAndModifyContent = async () => {
  //   // const localUploadedFiles: Record<string, string> = {};
  //   // setLoading(true);
  //   // console.log("uploading files");
  //   // const updatedContent = [];
  //   // console.log("content inside upload files", content);
  //   // for (const post of content) {
  //   //   console.log("inside for loop", post);
  //   //   if (post.socialType === "TWITTER") {
  //   //     const tweets = tweetsHere(content, post.id);
  //   //     const updatedTweets = [];
  //   //     for (const tweet of tweets) {
  //   //       if (tweet.files && tweet.files.length > 0) {
  //   //         const tweetUploadedFiles: string[] = tweet.uploadedFiles
  //   //           ? [...tweet.uploadedFiles]
  //   //           : [];
  //   //         for (const file of tweet.files) {
  //   //           const fileName = file.name;
  //   //           if (!localUploadedFiles[fileName]) {
  //   //             console.log("uploading twitter file", file.name);
  //   //             const { url } = await uploadToS3(file);
  //   //             tweetUploadedFiles.push(url);
  //   //             localUploadedFiles[fileName] = url;
  //   //           } else {
  //   //             tweetUploadedFiles.push(localUploadedFiles[fileName]!);
  //   //           }
  //   //         }
  //   //         setLoading(false);
  //   //         updatedTweets.push({
  //   //           ...tweet,
  //   //           uploadedFiles: tweetUploadedFiles,
  //   //           files: [],
  //   //           previewUrls: [],
  //   //         });
  //   //       } else {
  //   //         updatedTweets.push(tweet);
  //   //       }
  //   //     }
  //   //     updatedContent.push({
  //   //       ...post,
  //   //       content: updatedTweets,
  //   //     });
  //   //   } else {
  //   //     if (post.files && post.files.length > 0) {
  //   //       const postUploadedFiles: string[] = post.uploadedFiles
  //   //         ? [...post.uploadedFiles]
  //   //         : [];
  //   //       console.log("inside updatedContent");
  //   //       for (const file of post.files) {
  //   //         // Check if a similar file has already been uploaded
  //   //         const fileName = file.name;
  //   //         if (!localUploadedFiles[fileName]) {
  //   //           // File not uploaded yet, upload it
  //   //           const { url } = await uploadToS3(file);
  //   //           console.log("pusing new file", url);
  //   //           postUploadedFiles.push(url);
  //   //           localUploadedFiles[fileName] = url;
  //   //           console.log("localUploadedFiles", localUploadedFiles);
  //   //         } else {
  //   //           // File already uploaded, use the existing URL
  //   //           console.log(
  //   //             "pusing existing file",
  //   //             localUploadedFiles[fileName]!,
  //   //           );
  //   //           postUploadedFiles.push(localUploadedFiles[fileName]!);
  //   //         }
  //   //       }

  //   //       setLoading(false);
  //   //       // Update the post with uploaded files and remove the files array
  //   //       updatedContent.push({
  //   //         ...post,
  //   //         uploadedFiles: postUploadedFiles,
  //   //         files: [],
  //   //       });
  //   //     } else {
  //   //       // No files to upload, keep the post as is
  //   //       updatedContent.push(post);
  //   //     }
  //   //   }
  //   // }
  //   // setLoading(false);
  //   return post;
  // };

  const uploadFilesAndModifyContent = async () => {
    const localUploadedFiles: Record<string, string> = {};
    const updatedContent: ContentType[] = [];
    const updatedAlternativeContent: AlternativeContentType = [];

    console.log("uploading files");

    // Process main content
    for (const postContent of post.content) {
      console.log("inside for loop", postContent);
      if (postContent.media && postContent.media.length > 0) {
        const updatedMedia: MediaType[] = [];
        for (const mediaItem of postContent.media) {
          if (mediaItem.url) {
            updatedMedia.push(mediaItem);
            continue;
          }
          if (!mediaItem.file) {
            updatedMedia.push(mediaItem);
            continue;
          }
          const fileName = cleanFileName(mediaItem.file?.name);

          if (fileName && mediaItem.file) {
            if (!localUploadedFiles[fileName]) {
              console.log("uploading file", fileName);
              const { url, bucket, key } = await uploadToS3(mediaItem.file);
              localUploadedFiles[fileName] = url;

              updatedMedia.push({
                ...mediaItem,
                url: url,
                bucketUrl: bucket,
                bucketKey: key,
                file: undefined, // Clear the file after upload
                previewUrl: undefined, // Clear preview URL if needed
              });
            } else {
              updatedMedia.push({
                ...mediaItem,
                url: localUploadedFiles[fileName],
                file: undefined,
                previewUrl: undefined,
              });
            }
          } else {
            // If no file, just push the existing media item
            updatedMedia.push(mediaItem);
          }
        }
        updatedContent.push({
          ...postContent,
          media: updatedMedia,
        });
      } else {
        updatedContent.push(postContent);
      }
    }

    // Process alternative content
    for (const altContent of post.alternativeContent) {
      const updatedAltContent: ContentType[] = [];

      for (const postContent of altContent.content) {
        if (postContent.media && postContent.media.length > 0) {
          const updatedMedia: MediaType[] = [];

          for (const mediaItem of postContent.media) {
            if (mediaItem.url) {
              updatedMedia.push(mediaItem);
              continue;
            }
            if (!mediaItem.file) {
              updatedMedia.push(mediaItem);
              continue;
            }
            const fileName = cleanFileName(mediaItem.file.name);

            if (fileName && mediaItem.file) {
              if (!localUploadedFiles[fileName]) {
                console.log("uploading alternative content file", fileName);
                const { url, key, bucket } = await uploadToS3(mediaItem.file);
                localUploadedFiles[fileName] = url;

                updatedMedia.push({
                  ...mediaItem,
                  url: url,
                  bucketUrl: bucket,
                  bucketKey: key,
                  file: undefined, // Clear the file after upload
                  previewUrl: undefined, // Clear preview URL if needed
                });
              } else {
                updatedMedia.push({
                  ...mediaItem,
                  url: localUploadedFiles[fileName],
                  file: undefined,
                  previewUrl: undefined,
                });
              }
            } else {
              // If no file, just push the existing media item
              updatedMedia.push(mediaItem);
            }
          }

          updatedAltContent.push({
            ...postContent,
            media: updatedMedia,
          });
        } else {
          updatedAltContent.push(postContent);
        }
      }

      updatedAlternativeContent.push({
        ...altContent,
        content: updatedAltContent,
      });
    }

    console.log("Updated Content", updatedContent);
    console.log("Updated Alternative Content", updatedAlternativeContent);

    // Update the post with new content and alternative content, then return it
    return {
      ...post,
      content: updatedContent,
      alternativeContent: updatedAlternativeContent,
    };
  };

  return {
    uploadFilesAndModifyContent,
    loading,
    error,
    getValidAlternativeContent,
    getSocialTypeOfContent,
  };
}
