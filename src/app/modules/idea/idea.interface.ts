import type { IdeaStatus, IdeaType } from "../../../generated/prisma/enums";

export type ICreateIdeaPayload = {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  images?: string[];
  type?: IdeaType;
  price?: number;
  categoryId: string;
};

export type IUpdateIdeaPayload = {
  title?: string;
  problemStatement?: string;
  proposedSolution?: string;
  description?: string;
  images?: string[];
  existingImages?: string[];
  type?: IdeaType;
  price?: number;
  categoryId?: string;
};

export type IRejectIdeaPayload = {
  rejectionFeedback: string;
};

export type IIdeaFilterPayload = {
  search?: string;
  categoryId?: string;
  status?: IdeaStatus;
  type?: IdeaType;
  page?: number;
  limit?: number;
  sortBy?: "recent" | "top_voted";
};