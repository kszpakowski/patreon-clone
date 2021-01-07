import { MutationResolvers, User } from "./generated/graphql";
import jwt from "jsonwebtoken";
import { minio } from "./minio";
import { prisma } from "./prisma";
const argon = require("argon2");

//TODO init buckets

export const mutations: MutationResolvers = {
  async uploadPostAttachment(
    _,
    { postUploadInput: { postId, fileName } },
    { userId }
  ) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You must be authenticated to upload attachments",
            code: "401",
          },
        ],
      };
    }

    const isOwnPost =
      (await prisma.post.count({
        where: {
          id: postId,
          authorId: userId,
        },
      })) > 0;

    if (!isOwnPost) {
      return {
        errors: [
          {
            message:
              "this post desn't exist, or you are not authorized to access it",
            code: "403",
          },
        ],
      };
    }

    await prisma.attachment.create({
      data: {
        fileName,
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });

    const url = await minio.presignedPutObject(
      "attachments",
      `${postId}/${fileName}`
    );
    return {
      uploadUrl: url,
    };
  },
  async uploadAvatar(_, { fileName }, { userId }) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You must be logged in to upload avatar",
            code: "401",
          },
        ],
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarFileName: {
          set: fileName,
        },
      },
    });

    const uploadUrl = await minio.presignedPutObject(
      "avatars",
      `${userId}/fileName`
    );
    return {
      uploadUrl,
    };
  },
  async uploadCoverPhoto(_, { fileName }, { userId }) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You must be logged in to upload COVER PHOTO",
            code: "401",
          },
        ],
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        coverPhotoFileName: {
          set: fileName,
        },
      },
    });

    const uploadUrl = await minio.presignedPutObject(
      "covers",
      `${userId}/fileName`
    );
    return {
      uploadUrl,
    };
  },
  async register(_, { registerInput: { name, email, password } }) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await argon.hash(password),
        tiers: {
          // create default tiers
          create: [
            {
              name: "Basic",
              price: 5.0,
              description: "",
            },
            {
              name: "Silver",
              price: 15.0,
              description: "",
            },
            {
              name: "Gold",
              price: 25.0,
              description: "",
            },
          ],
        },
      },
    });
    return user as User;
  },
  async login(_, { loginInput: { email, password } }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const passMatch = await argon.verify(user?.password, password);
    if (!passMatch) {
      return {
        errors: [
          {
            message: "Invalid credentials",
            code: "400",
          },
        ],
      };
    }

    const token = jwt.sign({ sub: user?.id }, process.env.JWT_SIGNING_KEY!, {
      expiresIn: "7d",
    });
    return {
      token: token,
    };
  },
  async subscribe(_, { subscribeInput: { tierId } }, { userId }) {
    return prisma.tierSubscription.create({
      //TODO returns error if tier doesn't exist
      data: {
        owner: {
          connect: {
            id: userId,
          },
        },
        tier: {
          connect: {
            id: tierId,
          },
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentId: "uuid",
      },
    }) as any;
  },
  async createPost(_, { createPostInput: { title, tierId } }, { userId }) {
    const tiers = await prisma.tier.findMany({
      where: { ownerId: userId },
    });

    const isOwnTier = tiers.some((t) => t.id === tierId);

    if (!isOwnTier) {
      throw new Error("403"); // How to return Http 403?
    }

    const post = await prisma.post.create({
      data: {
        title,
        author: {
          connect: {
            id: userId,
          },
        },
        tier: {
          connect: {
            id: tierId,
          },
        },
      },
    });

    return post as any;
  },
  async commentPost(_, { commentPostInput: { message, postId } }, { userId }) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You need to log in in order to comment posts",
            code: "401",
          },
        ],
      };
    }

    const comment: any = await prisma.comment.create({
      data: {
        message,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return {
      comment,
    };
  },
  async replyComment(
    _,
    { commentReplyInput: { message, commentId } },
    { userId }
  ) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You need to log in in order to comment posts",
            code: "401",
          },
        ],
      };
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return {
        errors: [
          {
            message: `Comment with id ${commentId} does not exist`,
            code: "400",
          },
        ],
      };
    }

    const reply: any = await prisma.comment.create({
      data: {
        message,
        post: {
          connect: {
            id: comment.postId!,
          },
        },
        parentComment: {
          connect: {
            id: commentId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return {
      reply,
    };
  },
  async likeComment(_, { commentId }, { userId }) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You need to log in in order to like comments",
            code: "401",
          },
        ],
      };
    }

    try {
      const like = await prisma.commentLike.create({
        data: {
          comment: {
            connect: {
              id: commentId,
            },
          },
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {};
    } catch (err) {
      return {
        errors: [
          {
            message: `Comment with id ${commentId} does not exist, or you already like it`,
            code: "400",
          },
        ],
      };
    }
  },
  unlikeComment: async (_, { commentId }, { userId }) => {
    if (!userId) {
      return {
        errors: [
          {
            message: "You need to log in in order to ullike comments",
            code: "401",
          },
        ],
      };
    }

    try {
      await prisma.commentLike.deleteMany({
        where: {
          commentId,
          authorId: userId,
        },
      });
    } catch (err) {
      console.log(err);
    }

    return {};
  },
  async likePost(_, { postId }, { userId }) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You need to log in in order to like comments",
            code: "401",
          },
        ],
      };
    }
    try {
      await prisma.postLike.create({
        data: {
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      });
    } catch (err) {
      return {
        errors: [
          {
            message: `Post with id ${postId} does not exist or you already like it`,
            code: "400",
          },
        ],
      };
    }

    return {};
  },
  async unlikePost(_, { postId }, { userId }) {
    if (!userId) {
      return {
        errors: [
          {
            message: "You need to log in in order to like comments",
            code: "401",
          },
        ],
      };
    }

    await prisma.postLike.deleteMany({
      where: {
        authorId: userId,
        postId: postId,
      },
    });

    return {};
  },
};
