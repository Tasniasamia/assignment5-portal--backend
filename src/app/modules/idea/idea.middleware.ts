import type { NextFunction, Request, Response } from "express";

export const ideaUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // FormData থেকে JSON parse
  if (req?.body?.data) {
    req.body = JSON.parse(req.body.data);
  }

const files = req?.files as Record<string, Express.Multer.File[]>;

const existingImages: string[] = req.body.existingImages || [];
const hasNewImages = Array.isArray(files?.images) && files.images.length > 0;

if (hasNewImages) {
const newImages = (files.images ?? []).map((file: Express.Multer.File) => file.path);
  req.body.images = [...existingImages, ...newImages];
  } else {
    // ✅ নতুন image না দিলে → শুধু existing রাখো
    req.body.images = existingImages.length > 0 ? existingImages : undefined;
  }

  // ✅ existingImages body থেকে remove করো — service এ লাগবে না
  delete req.body.existingImages;

  next();
};