import { prisma } from "../../lib/prisma";
import { status } from "http-status";
import { IdeaStatus, Role } from "../../../generated/prisma/enums";
import type { JwtPayload } from "jsonwebtoken";
import type { ICreateCommentPayload } from "./comment.interface";
import type { IQueryParams } from "../../interfaces/query.interface";
import { AppError } from "../../errorHelplers/appError";
import { QueryBuilder } from "../../utils/queryBuilder";

const createComment = async (
  ideaId: string,
  payload: ICreateCommentPayload,
  user: JwtPayload
) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false, status: IdeaStatus.APPROVED },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  // Reply হলে parent comment check
  if (payload.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: payload.parentId, isDeleted: false },
    });
    if (!parentComment) {
      throw new AppError(status.NOT_FOUND, "Parent comment not found");
    }
  }

  const comment = await prisma.comment.create({
    data: {
      content: payload.content,
      ideaId,
      authorId: user?.id,
      parentId: payload.parentId || null,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return comment;
};

const getCommentsByIdea = async (ideaId: string, query: IQueryParams) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  const builder = new QueryBuilder(
    query,
    "comment",
    [],
    ["content"],
    [],
    ["author"]
  );

  // শুধু top-level comments (parentId = null)
  builder.filterCondition.push(
    { ideaId },
    { isDeleted: false },
    { parentId: null }
  );

  builder.callAll();

  // nested replies include
  builder.include = {
    author: {
      select: { id: true, name: true, image: true },
    },
    replies: {
      where: { isDeleted: false },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    },
    _count: {
      select: { replies: true },
    },
  };

  return await builder.fetch();
};

const deleteComment = async (commentId: string, user: JwtPayload) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId, isDeleted: false },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found");
  }

  if (user?.role !== Role.ADMIN && comment.authorId !== user?.id) {
    throw new AppError(status.FORBIDDEN, "You are not authorized");
  }

  const deleted = await prisma.comment.update({
    where: { id: commentId },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return deleted;
};

export const commentService = {
  createComment,
  getCommentsByIdea,
  deleteComment,
};