import { z } from "zod";
import { IdeaType } from "../../../generated/prisma/enums";

const createIdeaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  problemStatement: z.string().min(10, "Problem statement is required"),
  proposedSolution: z.string().min(10, "Proposed solution is required"),
  description: z.string().min(20, "Description is required"),
  images: z.array(z.string().url()).optional(),
  type: z.nativeEnum(IdeaType).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().uuid("Invalid category"),
  isPublished: z.boolean().optional(),
});

const updateIdeaSchema = z.object({
  title: z.string().min(5).optional(),
  problemStatement: z.string().min(10).optional(),
  proposedSolution: z.string().min(10).optional(),
  description: z.string().min(20).optional(),
  images: z.array(z.string().url()).optional(),
  existingImages: z.array(z.string().url()).optional(),
  type: z.nativeEnum(IdeaType).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
});

const rejectIdeaSchema = z.object({
  rejectionFeedback: z.string().min(10, "Feedback must be at least 10 characters"),
});

export const ideaValidationSchema = {
  createIdeaSchema,
  updateIdeaSchema,
  rejectIdeaSchema,
};