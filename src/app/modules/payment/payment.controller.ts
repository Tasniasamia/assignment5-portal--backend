import type { Request, Response } from "express";

import { paymentService } from "./payment.service";
import { status } from "http-status";
import  { catchAsyncHandler } from "../../shared/catchAsyncHandler";
import { sendResponse } from "../../shared/sendResponse";

const initiatePayment = catchAsyncHandler(async (req: Request, res: Response) => {
 
  const result = await paymentService.initiatePayment(req.body.ideaId, req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  return await paymentService.handleStripeWebhookEvent(req, res);
};

const verifyPayment = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.verifyPayment(req.params.ideaId as string, req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payment status fetched",
    data: result,
  });
});

const getMyPayments = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.getMyPayments(req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payments fetched successfully",
    data: result,
  });
});

export const paymentController = {
  initiatePayment,
  handleStripeWebhookEvent,
  verifyPayment,
  getMyPayments,
};