import type {
  ContentType,
  FullPostType,
  SavePostInputType,
  SocialProviderType,
} from "@aperturs/validators/post";
import { db, eq, schema } from "@aperturs/db";

interface SavePostInputBackend extends SavePostInputType {
  userId: string;
}

export async function saveDraftToDatabase({ ...input }: SavePostInputBackend) {
  const post = await db
    .transaction(async (trx) => {
      const mainPost = await trx
        .insert(schema.post)
        .values({
          status: input.scheduledTime ? "SCHEDULED" : "SAVED",
          postType: input.postType,
          clerkUserId: input.userId,
          content: input.content,
          updatedAt: new Date(),
          scheduledAt: input.scheduledTime
            ? new Date(input.scheduledTime)
            : null,
        })
        .returning();
      if (!mainPost[0]) {
        throw new Error("Failed to create post");
      }
      const mainPostId = mainPost[0].id;
      for (const socialProvider of input.socialProviders) {
        await trx.insert(schema.postToSocialProvider).values({
          postId: mainPostId,
          socialProviderId: socialProvider.socialId,
        });
      }
      for (const alterContent of input.alternativeContent) {
        const alterContentId = await trx
          .insert(schema.alternatePostContent)
          .values({
            postId: mainPostId,
            socialProviderId: alterContent.socialProvider.socialId,
            content: alterContent.content,
          });
        if (!alterContentId[0]) {
          throw new Error("Failed to create alternative content");
        }
      }
      return mainPost[0];
    })
    .catch((error) => {
      console.error("Failed to save draft from saveDraftsToDatabase", error);
      throw error;
    });
  console.log(post);
  return post;
}

interface UpdatePostInputBackend extends SavePostInputBackend {
  userId: string;
  postId: string;
  status?: "SAVED" | "PUBLISHED" | "SCHEDULED";
}

export async function updateDraftToDatabase({
  ...input
}: UpdatePostInputBackend) {
  const post = await db.transaction(async (trx) => {
    const mainPost = await trx
      .update(schema.post)
      .set({
        status: input.status
          ? input.status
          : input.scheduledTime
            ? "SCHEDULED"
            : "SAVED",
        postType: input.postType,
        content: input.content,
        clerkUserId: input.userId,
        updatedAt: new Date(),
        scheduledAt: input.scheduledTime ? new Date(input.scheduledTime) : null,
      })
      .where(eq(schema.post.id, input.postId))
      .returning();

    if (!mainPost[0]) {
      throw new Error("Failed to update post");
    }
    const mainPostId = mainPost[0].id;

    for (const socialProvider of input.socialProviders) {
      await trx
        .insert(schema.postToSocialProvider)
        .values({
          postId: mainPostId,
          socialProviderId: socialProvider.socialId,
        })
        .onConflictDoUpdate({
          target: [
            schema.postToSocialProvider.postId,
            schema.postToSocialProvider.socialProviderId,
          ],
          set: {
            postId: mainPostId,
            socialProviderId: socialProvider.socialId,
          },
        });
    }
    for (const alterContent of input.alternativeContent) {
      const alterContentId = await trx
        .insert(schema.alternatePostContent)
        .values({
          postId: mainPostId,
          socialProviderId: alterContent.socialProvider.socialId,
          content: alterContent.content,
        })
        .onConflictDoUpdate({
          target: [
            schema.alternatePostContent.postId,
            schema.alternatePostContent.socialProviderId,
          ],
          set: {
            content: alterContent.content,
          },
        });
      if (!alterContentId[0]) {
        throw new Error("Failed to create alternative content");
      }
    }
    return mainPost[0];
  });
  return post;
}

export async function getDraftsFromDatabase({ postId }: { postId: string }) {
  const post = await db.query.post.findFirst({
    where: eq(schema.post.id, postId),
    with: {
      alternatePostContent: {
        with: {
          socialProvider: true,
        },
      },
      postToSocialProviders: {
        with: {
          socialProvider: true,
        },
      },
    },
  });
  return post;
}

export async function makingPostsFrontendCompatible({
  postId,
}: {
  postId: string;
}) {
  const post = await getDraftsFromDatabase({ postId });
  if (!post) {
    throw new Error("Post not found");
  }
  const fullPost = {
    id: post.id,
    postType: post.postType,
    scheduledTime: post.scheduledAt,
    content: post.content.map((content) => ({
      id: content.id,
      name: content.name,
      order: content.order,
      text: content.text,
      media: content.media,
      tags: content.tags,
    })),
    alternativeContent: post.alternatePostContent.map((alterContent) => ({
      socialProvider: {
        socialId: alterContent.socialProvider.id,
        name: alterContent.socialProvider.fullName,
        socialType: alterContent.socialProvider.socialType,
      },
      content: alterContent.content.map((content) => ({
        id: content.id,
        name: content.name,
        order: content.order,
        text: content.text,
        media: content.media,
        tags: content.tags,
      })) as ContentType[],
    })),
  } as FullPostType;

  const socialProviders = post.postToSocialProviders.map((provider) => {
    return {
      socialId: provider.socialProvider.id,
      name: provider.socialProvider.fullName,
      socialType: provider.socialProvider.socialType,
    };
  }) as SocialProviderType[];

  return {
    post: fullPost,
    socialProviders,
  };
}
