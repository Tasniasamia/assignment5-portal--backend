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

  const files = req?.files as {
    [fieldName: string]: Express.Multer.File[];
  };

  if (Array.isArray(files?.images) && files.images.length > 0) {
    const newImages = files.images.map((file) => file.path);

    // পুরনো images থাকলে merge করো
    req.body.images = [
      ...(req.body.existingImages || []),
      ...newImages,
    ];
  }

  next();
};