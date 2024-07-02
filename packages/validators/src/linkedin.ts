import { z } from "zod";

// Define enums using Zod
const MediaLibraryStatus = z.enum(["ACTIVE", "ARCHIVED"]);
const MediaStatus = z.enum([
  "PROCESSING",
  "PROCESSING_FAILED",
  "AVAILABLE",
  "WAITING_UPLOAD",
]);

// Define URN, URL, and Time types
const URN = z.string();
const URL = z.string();
const Time = z.number();

// Define MediaLibraryMetadata schema
const MediaLibraryMetadata = z.object({
  associatedAccount: URN,
  assetName: z.string(),
  mediaLibraryStatus: MediaLibraryStatus.optional(),
});

// Define InitializeUploadRequest schema
const InitializeUploadRequest = z.object({
  mediaLibraryMetadata: MediaLibraryMetadata.optional(),
  owner: URN,
});

// Define MediaAsset schema
export const MediaAsset = z.object({
  aspectRatioHeight: z.number().nullable().optional(),
  aspectRatioWidth: z.number().nullable().optional(),
  downloadUrl: URL.nullable().optional(),
  downloadUrlExpiresAt: Time.optional(),
  id: URN.optional(),
  mediaLibraryMetadata: MediaLibraryMetadata.optional(),
  owner: URN,
  status: MediaStatus.optional(),
  altText: z.string().max(4086).optional(),
  initializeUploadRequest: InitializeUploadRequest.optional(),
});

export const MediaUploadInitializeResponse = z.object({
  value: z.object({
    uploadUrlExpiresAt: z.number(),
    uploadUrl: z.string().url(),
    image: z.string(),
  }),
});

const uploadMechanismResponseSchema = z.object({
  "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": z.object({
    headers: z.record(z.string(), z.string()), // Assuming headers is a record with string keys and string values
    uploadUrl: z.string().url(),
  }),
});

const valueSchema = z.object({
  uploadMechanism: uploadMechanismResponseSchema,
  mediaArtifact: z.string(),
  asset: z.string(),
});

export const LinkedinMediaUploadResponse = z.object({
  value: valueSchema,
});

// TypeScript type inferred from the Zod schema
export type LinkedinMediaUploadResponse = z.infer<
  typeof LinkedinMediaUploadResponse
>;

// TypeScript types generated from Zod schemas
export type MediaLibraryStatus = z.infer<typeof MediaLibraryStatus>;
type MediaStatus = z.infer<typeof MediaStatus>;
type MediaLibraryMetadata = z.infer<typeof MediaLibraryMetadata>;
type InitializeUploadRequest = z.infer<typeof InitializeUploadRequest>;
export type MediaAsset = z.infer<typeof MediaAsset>;
