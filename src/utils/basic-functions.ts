import { SocialType } from "~/types/post-enums";
import { type PostContentType } from "~/types/post-types";

export function defaultContent(content: string): PostContentType[] {
  return [
    {
      id: SocialType.Default,
      name: SocialType.Default,
      socialType: SocialType.Default,
      content: content,
      unique: true,
      files: [],
      uploadedFiles: [],
    },
  ];
}
