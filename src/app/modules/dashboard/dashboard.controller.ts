import type { Request, Response } from "express";
import { status } from "http-status";
// import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
// import { sendResponse } from "../../utils/sendResponse";
import { dashboardService } from "./dashboard.service";
import { catchAsyncHandler } from "../../shared/catchAsyncHandler";
import { sendResponse } from "../../shared/sendResponse";

const getAdminStats = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.getAdminStats();
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin stats fetched successfully",
    data: result,
  });
});

const getMemberStats = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.getMemberStats(req.user);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member stats fetched successfully",
    data: result,
  });
});

const getAllUsers = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.getAllUsers(req.query);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const updateUserStatus = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.updateUserStatus(
    req.params.userId as string,
    req.body.status
  );
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const updateUserRole = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.updateUserRole(
    req.params.userId as string,
    req.body.role
  );
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const deleteUser = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.deleteUser(req.params.userId as string);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const dashboardController = {
  getAdminStats,
  getMemberStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};