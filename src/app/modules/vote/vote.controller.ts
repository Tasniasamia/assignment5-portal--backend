import type { Request, Response } from "express";
import { status } from "http-status";
import { voteService } from "./vote.service";
import  { catchAsyncHandler } from "../../shared/catchAsyncHandler";
import { sendResponse } from "../../shared/sendResponse";

const voteIdea = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await voteService.voteIdea(
    req.params.ideaId as string,
    req.body,
    req.user
  );
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Vote recorded successfully",
    data: result,
  });
});

const removeVote = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await voteService.removeVote(req.params.ideaId as string, req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Vote removed successfully",
    data: result,
  });
});

const getVoteCount = catchAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await voteService.getVoteCount(req.params.ideaId as string, userId);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Vote count fetched successfully",
    data: result,
  });
});

export const voteController = {
  voteIdea,
  removeVote,
  getVoteCount,
};