import { status } from "http-status";

import { ideaService } from "./idea.service";
import  { catchAsyncHandler } from "../../shared/catchAsyncHandler";
import { sendResponse } from "../../shared/sendResponse";
import type { Request, Response } from "express";
import type { IQueryParams } from "../../interfaces/query.interface";

const createIdea = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.createIdea(req.body, req.user);
  return sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Idea created successfully",
    data: result,
  });
});

const submitIdea = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.submitIdea(req.params.id as string, req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea submitted for review",
    data: result,
  });
});

const getAllIdeas = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.getAllIdeas(req.query as IQueryParams);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result,
  });
});

const getIdeaById = catchAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;  // ✅ role নাও

  const result = await ideaService.getIdeaById(req.params.id as string, userId, role);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea fetched successfully",
    data: result,
  });
});

const updateIdea = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.updateIdea(
    req.params.id as string,
    req.body,
    req.user
  );
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea updated successfully",
    data: result,
  });
});

const deleteIdea = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.deleteIdea(req.params.id as string, req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result,
  });
});

const approveIdea = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.approveIdea(req.params.id as string as string);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea approved successfully",
    data: result,
  });
});

const rejectIdea = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.rejectIdea(req.params.id as string as string, req.body);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea rejected",
    data: result,
  });
});

const getMyIdeas = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.getMyIdeas(req.user, req.query as IQueryParams);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "My ideas fetched successfully",
    data: result,
  });
});

const getAllIdeasAdmin = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const result = await ideaService.getAllIdeasAdmin(req.query as IQueryParams);
    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "All ideas fetched successfully",
      data: result,
    });
  }
);


const moveToUnderReview = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.moveToUnderReview(req.params.id as string);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea moved to under review",
    data: result,
  });
});







const getPaymentIdeasByAdmin = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.getPaymentIdeasByAdmin(req.query as IQueryParams);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result,
  });
});


const getMySoldIdeas = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.getMySoldIdeas(req.user, req.query as IQueryParams);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Sold payments fetched successfully",
    data: result,
  });
});

const getMyBoughtIdeas = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await ideaService.getMyBoughtIdeas(req.user, req.query as IQueryParams);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "My payments fetched successfully",
    data: result,
  });
});


















export const ideaController = {
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
  moveToUnderReview,
  getPaymentIdeasByAdmin,
  getMySoldIdeas,
  getMyBoughtIdeas
};