import type {
  ContentType,
  FullPostType,
  SavePostInputType,
} from "@aperturs/validators/post";
import { db, eq, schema } from "@aperturs/db";

interface SavePostInputBackend extends SavePostInputType {
  userId: string;
}

export async function saveDraftToDatabase({ ...input }: SavePostInputBackend) {
  const post = await db.transaction(async (trx) => {
    const mainPost = await trx
      .insert(schema.post)
      .values({
        status: input.scheduledTime ? "SCHEDULED" : "SAVED",
        postType: input.postType,
        clerkUserId: input.userId,
        updatedAt: new Date(),
        scheduledAt: input.scheduledTime ? new Date(input.scheduledTime) : null,
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
    for (const content of input.content) {
      await trx.insert(schema.postContent).values({
        postId: mainPostId,
        name: content.name,
        order: content.order,
        text: content.text,
        media: content.media,
        tags: content.tags,
        updatedAt: new Date(),
      });
    }
    for (const alterContent of input.alternativeContent) {
      const alterContentId = await trx
        .insert(schema.alternatePostContent)
        .values({
          postId: mainPostId,
          socialProviderId: alterContent.socialProvider.socialId,
        });
      if (!alterContentId[0]) {
        throw new Error("Failed to create alternative content");
      }
      for (const content of alterContent.content) {
        await trx.insert(schema.postContent).values({
          postId: mainPostId,
          name: content.name,
          order: content.order,
          text: content.text,
          media: content.media,
          tags: content.tags,
          socialProviderId: alterContent.socialProvider.socialId,
          updatedAt: new Date(),
        });
      }
    }
    return mainPost[0];
  });
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

    for (const content of input.content) {
      await trx
        .insert(schema.postContent)
        .values({
          postId: mainPostId,
          name: content.name,
          order: content.order,
          text: content.text,
          media: content.media,
          tags: content.tags,
          updatedAt: new Date(),
          id: content.id,
        })
        .onConflictDoUpdate({
          target: schema.postContent.id,
          set: {
            name: content.name,
            order: content.order,
            text: content.text,
            media: content.media,
            tags: content.tags,
            updatedAt: new Date(),
          },
        });
    }
    for (const alterContent of input.alternativeContent) {
      const alterContentId = await trx
        .insert(schema.alternatePostContent)
        .values({
          postId: mainPostId,
          socialProviderId: alterContent.socialProvider.socialId,
        })
        .onConflictDoUpdate({
          target: [
            schema.alternatePostContent.postId,
            schema.alternatePostContent.socialProviderId,
          ],
          set: {
            postId: mainPostId,
            socialProviderId: alterContent.socialProvider.socialId,
          },
        });
      if (!alterContentId[0]) {
        throw new Error("Failed to create alternative content");
      }
      for (const content of alterContent.content) {
        await trx
          .insert(schema.postContent)
          .values({
            id: content.id,
            postId: mainPostId,
            name: content.name,
            order: content.order,
            text: content.text,
            media: content.media,
            tags: content.tags,
            socialProviderId: alterContent.socialProvider.socialId,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: schema.postContent.id,
            set: {
              name: content.name,
              order: content.order,
              text: content.text,
              media: content.media,
              tags: content.tags,
              socialProviderId: alterContent.socialProvider.socialId,
              updatedAt: new Date(),
            },
          });
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
      postContents: true,
      alternatePostContent: {
        with: {
          postContents: true,
          socialProvider: true,
        },
      },
      socialProviders: {
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
    content: post.postContents.map((content) => ({
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
      content: alterContent.postContents.map((content) => ({
        id: content.id,
        name: content.name,
        order: content.order,
        text: content.text,
        media: content.media,
        tags: content.tags,
      })) as ContentType[],
    })),
    socialProviders: post.socialProviders.map((provider) => ({
      socialId: provider.socialProviderId,
      name: provider.socialProvider.fullName,
      socialType: provider.socialProvider.socialType,
    })),
  } as FullPostType;

  return fullPost;
}
