import { prisma } from "../../lib/prisma";
import { status } from "http-status";
import {
  IdeaStatus,
  IdeaType,
  Role,
} from "../../../generated/prisma/enums";
import type { JwtPayload } from "jsonwebtoken";
import type {
  ICreateIdeaPayload,
  IIdeaFilterPayload,
  IRejectIdeaPayload,
  IUpdateIdeaPayload,
} from "./idea.interface";
import { AppError } from "../../errorHelplers/appError";

const createIdea = async (payload: ICreateIdeaPayload, user: JwtPayload) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId, isDeleted: false },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  if (payload.type === IdeaType.PAID && !payload.price) {
    throw new AppError(status.BAD_REQUEST, "Price is required for paid ideas");
  }

  const idea = await prisma.idea.create({
    data: {
      title: payload.title,
      problemStatement: payload.problemStatement,
      proposedSolution: payload.proposedSolution,
      description: payload.description,
      images: payload.images || [],
      type: payload.type || IdeaType.FREE,
      price: payload.price || null,
      isPaid: payload.type === IdeaType.PAID,
      status: IdeaStatus.DRAFT,
      authorId: user?.id,
      categoryId: payload.categoryId,
    },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return idea;
};

const submitIdea = async (ideaId: string, user: JwtPayload) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (idea.authorId !== user?.id) {
    throw new AppError(status.FORBIDDEN, "You are not authorized");
  }

  if (idea.status !== IdeaStatus.DRAFT) {
    throw new AppError(status.BAD_REQUEST, "Only draft ideas can be submitted");
  }

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: IdeaStatus.UNDER_REVIEW },
  });

  return updated;
};

const getAllIdeas = async (filters: IIdeaFilterPayload) => {
  const {
    search,
    categoryId,
    type,
    page = 1,
    limit = 10,
    sortBy = "recent",
  } = filters;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    status: IdeaStatus.APPROVED,
    isDeleted: false,
    ...(categoryId && { categoryId }),
    ...(type && { type }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { problemStatement: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const orderBy =
    sortBy === "top_voted"
      ? { votes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
    }),
    prisma.idea.count({ where }),
  ]);

  return {
    data: ideas,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getIdeaById = async (ideaId: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  // view count বাড়াও
  await prisma.idea.update({
    where: { id: ideaId },
    data: { viewCount: { increment: 1 } },
  });

  return idea;
};

const updateIdea = async (
  ideaId: string,
  payload: IUpdateIdeaPayload,
  user: JwtPayload
) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (idea.authorId !== user?.id) {
    throw new AppError(status.FORBIDDEN, "You are not authorized");
  }

  if (
    idea.status !== IdeaStatus.DRAFT &&
    idea.status !== IdeaStatus.REJECTED
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "Only draft or rejected ideas can be edited"
    );
  }

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      ...(payload.title && { title: payload.title }),
      ...(payload.problemStatement && {
        problemStatement: payload.problemStatement,
      }),
      ...(payload.proposedSolution && {
        proposedSolution: payload.proposedSolution,
      }),
      ...(payload.description && { description: payload.description }),
      ...(payload.images && { images: payload.images }),
      ...(payload.categoryId && { categoryId: payload.categoryId }),
      ...(payload.type && { type: payload.type }),
      ...(payload.price && { price: payload.price }),
    },
  });

  return updated;
};

const deleteIdea = async (ideaId: string, user: JwtPayload) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (user?.role !== Role.ADMIN && idea.authorId !== user?.id) {
    throw new AppError(status.FORBIDDEN, "You are not authorized");
  }

  if (user?.role !== Role.ADMIN && idea.status !== IdeaStatus.DRAFT) {
    throw new AppError(status.BAD_REQUEST, "Only draft ideas can be deleted");
  }

  const deleted = await prisma.idea.update({
    where: { id: ideaId },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return deleted;
};

const approveIdea = async (ideaId: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (idea.status !== IdeaStatus.UNDER_REVIEW) {
    throw new AppError(status.BAD_REQUEST, "Idea is not under review");
  }

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: IdeaStatus.APPROVED },
  });

  return updated;
};

const rejectIdea = async (ideaId: string, payload: IRejectIdeaPayload) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (idea.status !== IdeaStatus.UNDER_REVIEW) {
    throw new AppError(status.BAD_REQUEST, "Idea is not under review");
  }

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      status: IdeaStatus.REJECTED,
      rejectionFeedback: payload.rejectionFeedback,
    },
  });

  return updated;
};

const getMyIdeas = async (user: JwtPayload, filters: IIdeaFilterPayload) => {
  const { page = 1, limit = 10 } = filters;
  const skip = (Number(page) - 1) * Number(limit);

  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where: { authorId: user?.id, isDeleted: false },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        _count: {
          select: { votes: true, comments: true },
        },
      },
    }),
    prisma.idea.count({
      where: { authorId: user?.id, isDeleted: false },
    }),
  ]);

  return {
    data: ideas,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getAllIdeasAdmin = async (filters: IIdeaFilterPayload) => {
  const { status: ideaStatus, page = 1, limit = 10 } = filters;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    isDeleted: false,
    ...(ideaStatus && { status: ideaStatus }),
  };

  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
    }),
    prisma.idea.count({ where }),
  ]);

  return {
    data: ideas,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const ideaService = {
  createIdea,
  submitIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  approveIdea,
  rejectIdea,
  getMyIdeas,
  getAllIdeasAdmin,
};