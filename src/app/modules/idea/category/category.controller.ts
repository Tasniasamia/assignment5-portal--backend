import type { Request, Response } from "express";
import { status } from "http-status";

import { categoryService } from "./category.service";
import { sendResponse } from "../../../shared/sendResponse";
import { catchAsyncHandler } from "../../../shared/catchAsyncHandler";

const createCategory = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);

  return sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories();

  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

const getCategoryById = catchAsyncHandler(async (req: Request, res: Response) => {
  const {id}= req.params;
  const result = await categoryService.getCategoryById(id as string);

  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});




const updateCategory = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryService.updateCategory(id as string, req.body);

  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(id as string);

  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
};