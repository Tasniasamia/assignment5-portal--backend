// import type { NextFunction, Request, Response } from "express";

// export const authUploadMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // FormData থেকে JSON parse
//   if (req?.body?.data) {
//     req.body = JSON.parse(req.body.data);
//   }

// // const files = req?.files as Record<string, Express.Multer.File[]>;

// const existingImages: string = req.body.image || '';
// // const hasNewImages = Array.isArray(files?.file) && files.file.length > 0;

// // if (hasNewImages) {
// // const newImages = (files.file ?? []).map((file: Express.Multer.File) => file.path);
// //   req.body.images = [...existingImages, ...newImages];
// //   } 
// //   else {
//     // ✅ নতুন image না দিলে → শুধু existing রাখো
//     req.body.image = existingImages.length ? existingImages : req?.files?.file ? (req.files as Record<string, Express.Multer.File[]>).file[0].path : undefined;
// //   }

//   // ✅ existingImages body থেকে remove করো — service এ লাগবে না
//   delete req.body.image;

//   next();
// };