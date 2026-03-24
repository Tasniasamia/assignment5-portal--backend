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
import { QueryBuilder } from "../../utils/queryBuilder";
import type { IQueryParams } from "../../interfaces/query.interface";

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
      status:payload?.isPublished? IdeaStatus.PENDING : IdeaStatus.DRAFT,
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

const getAllIdeas = async (query: IQueryParams) => {
  const stringSearchFields = [
    "title",
    "description",
    "problemStatement",
    "author.name",
    "category.name",
  ];

  const builder = new QueryBuilder(
    query,
    "idea",
    [],
    stringSearchFields,
    [],
    ["author", "category"]
  );

  // ✅ Default filters
  builder.filterCondition.push(
    { status: IdeaStatus.APPROVED },
    { isDeleted: false }
  );

  builder.callAll();

  // ✅ top_voted sort handle
  if (query.sortBy === "top_voted") {
    builder.orderBy = { votes: { _count: "desc" } };
  }

  // ✅ include set করো — fetch() এটাই use করবে
  builder.include = {
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
  };

  // ✅ fetch() — pagination, count, findMany সব handle করে
  return await builder.fetch();
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
            ...(payload.images !== undefined && { images: payload.images }), 
    ...(payload.title && { title: payload.title }),
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

  if ((idea.status !== IdeaStatus.UNDER_REVIEW)) {
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




const moveToUnderReview = async (ideaId: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });



  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }



  if (idea.status !== IdeaStatus.PENDING) {
    throw new AppError(status.BAD_REQUEST, "Only pending ideas can be moved to under review");
  }

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: IdeaStatus.UNDER_REVIEW },
  });

  return updated;
};























const getMyIdeas = async (user: JwtPayload, query: IQueryParams) => {
  const stringSearchFields = ["title", "description", "problemStatement"];

  const builder = new QueryBuilder(
    query,
    "idea",
    [],
    stringSearchFields,
    [],
    ["author", "category"]
  );

  // ✅ authorId আর isDeleted must
  builder.filterCondition.push(
    { authorId: user?.id },
    { isDeleted: false }
  );

  builder.callAll();

  // ✅ include set করো
  builder.include = {
    category: true,
    _count: {
      select: {
        votes: true,
        comments: true,
      },
    },
  };

  // ✅ fetch() directly
  return await builder.fetch();
};

const getAllIdeasAdmin = async (query: IQueryParams) => {
 const stringSearchFields = [
    "title",
    "description",
    "problemStatement",
    "author.name",
    "category.name",
  ];

  const builder = new QueryBuilder(
    query,
    "idea",
    [],
    stringSearchFields,
    [],
    ["author", "category"]
  );

  // // ✅ Default filters
  // builder.filterCondition.push(
  //   { status: IdeaStatus.APPROVED },
  //   { isDeleted: false }
  // );

  builder.callAll();

  // ✅ top_voted sort handle
  if (query.sortBy === "top_voted") {
    builder.orderBy = { votes: { _count: "desc" } };
  }

  // ✅ include set করো — fetch() এটাই use করবে
  builder.include = {
    category: true,
    author: true,
    _count: {
      select: {
        votes: true,
        comments: true,
      },
    },
  };

  // ✅ fetch() — pagination, count, findMany সব handle করে
  return await builder.fetch();
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
  moveToUnderReview
};