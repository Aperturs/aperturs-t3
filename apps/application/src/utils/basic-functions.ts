import type { PostContentType } from "@aperturs/validators/post";
import { SocialType } from "@aperturs/validators/post";

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
