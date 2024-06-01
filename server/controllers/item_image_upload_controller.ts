import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import AppError from "./appErros";
import catchAsync from "../utils/catchAsync";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const fileFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: CallableFunction
) {
  // Allowed file extensions
  const fileTypes = /jpg|png|jpeg/;

  const mimetype = fileTypes.test(file.mimetype);
  console.log(`MIME type: ${mimetype}`);
  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new AppError("Only images are allowed", 500));
  }
};
export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  console.log(req.file);

  if (req.file === undefined || req.file === null) {
    throw new AppError("No image uploaded", 400);
  }
  const imageUrl = `${process.env.LOCAL_HOST}uploads/${req.file?.filename}`;
  res.status(200).json({
    status: "Item uploaded successfully",
    data: req.file,
    url: imageUrl,
  });
});
