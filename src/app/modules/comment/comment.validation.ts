import { z } from "zod";

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  parentId: z.string().uuid().optional(),
});

export const commentValidationSchema = {
  createCommentSchema,
};