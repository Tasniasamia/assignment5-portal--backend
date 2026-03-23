import type { Request, Response } from "express";
import { catchAsyncHandler } from "../../shared/catchAsyncHandler";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";



const createAdmin = catchAsyncHandler(async (req: Request, res: Response) => {
  const payload = await req.body;
  const data = await userService.createAdmin(payload);
  if (data) {
    return await sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Admin registred successfully",
      data: data,
    });
  }
  throw new Error("Admin registration failed");
});



export const userController = {  createAdmin};
