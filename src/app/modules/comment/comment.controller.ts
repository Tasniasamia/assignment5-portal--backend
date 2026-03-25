import type { Request, Response } from "express";
import { status } from "http-status";
import { commentService } from "./comment.service";
import type { IQueryParams } from "../../interfaces/query.interface";
import { catchAsyncHandler } from "../../shared/catchAsyncHandler";
import { sendResponse } from "../../shared/sendResponse";

const createComment = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await commentService.createComment(
    req.params.ideaId as string,
    req.body,
    req.user
  );
  return sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result,
  });
});

const getCommentsByIdea = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const result = await commentService.getCommentsByIdea(
      req.params.ideaId as string,
      req.query as IQueryParams
    );
    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Comments fetched successfully",
      data: result,
    });
  }
);

const deleteComment = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await commentService.deleteComment(req.params.id as string, req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const commentController = {
  createComment,
  getCommentsByIdea,
  deleteComment,
};