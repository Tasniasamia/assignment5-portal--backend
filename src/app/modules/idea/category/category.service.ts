
import { status } from "http-status";
import type { ICreateCategoryPayload, IUpdateCategoryPayload } from "./category.interface";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../errorHelplers/appError";

const createCategory = async (payload: ICreateCategoryPayload) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new AppError(status.CONFLICT, "Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name as string,
      description: payload.description as string,
    },
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

  return categories;
};
const getCategoryById = async (id:string) => {
  const categories = await prisma.category.findUnique({

    where: { id:id, isDeleted: false }
  });

  return categories;
};
const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
  const existing = await prisma.category.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  // নাম change করলে duplicate check
  if (payload.name && payload.name !== existing.name) {
    const duplicate = await prisma.category.findUnique({
      where: { name: payload.name },
    });
    if (duplicate) {
      throw new AppError(status.CONFLICT, "Category name already exists");
    }
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.description && { description: payload.description }),
    },
  });

  return updated;
};

const deleteCategory = async (id: string) => {
  const existing = await prisma.category.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  // Soft delete
  const deleted = await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deleted;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
};