import { prisma } from "../../lib/prisma";
// import { AppError } from "../../errors/AppError";
import { status } from "http-status";
import { IdeaStatus, VoteType } from "../../../generated/prisma/enums";
import type { JwtPayload } from "jsonwebtoken";
import type { IVotePayload } from "./vote.interface";
import { AppError } from "../../errorHelplers/appError";

const voteIdea = async (
  ideaId: string,
  payload: IVotePayload,
  user: JwtPayload
) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false, status: IdeaStatus.APPROVED },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  // আগের vote আছে কিনা check
  const existingVote = await prisma.vote.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } },
  });

  // Same vote type আবার দিলে remove হবে (toggle)
  if (existingVote) {
    if (existingVote.type === payload.type) {
      await prisma.vote.delete({
        where: { ideaId_userId: { ideaId, userId: user?.id } },
      });
      return { message: `${payload.type} removed` };
    }

    // ভিন্ন vote type হলে update হবে
    const updated = await prisma.vote.update({
      where: { ideaId_userId: { ideaId, userId: user?.id } },
      data: { type: payload.type },
    });
    return updated;
  }

  // নতুন vote
  const vote = await prisma.vote.create({
    data: {
      type: payload.type,
      ideaId,
      userId: user?.id,
    },
  });

  return vote;
};

const removeVote = async (ideaId: string, user: JwtPayload) => {
  const existingVote = await prisma.vote.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } },
  });

  if (!existingVote) {
    throw new AppError(status.NOT_FOUND, "Vote not found");
  }

  await prisma.vote.delete({
    where: { ideaId_userId: { ideaId, userId: user?.id } },
  });

  return { message: "Vote removed successfully" };
};

const getVoteCount = async (ideaId: string, userId?: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  const [upvotes, downvotes, userVote] = await Promise.all([
    prisma.vote.count({ where: { ideaId, type: VoteType.UPVOTE } }),
    prisma.vote.count({ where: { ideaId, type: VoteType.DOWNVOTE } }),
    // Login থাকলে user এর vote কী সেটাও দেখাবে
    userId
      ? prisma.vote.findUnique({
          where: { ideaId_userId: { ideaId, userId } },
        })
      : null,
  ]);

  return {
    upvotes,
    downvotes,
    total: upvotes - downvotes,
    userVote: userVote?.type || null, // UPVOTE, DOWNVOTE, null
  };
};

export const voteService = {
  voteIdea,
  removeVote,
  getVoteCount,
};