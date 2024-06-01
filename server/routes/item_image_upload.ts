import Express from "express";
import {
  uploadImage,
  storage,
  fileFilter,
} from "./../controllers/item_image_upload_controller";
import multer from "multer";

const uploadStorage = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // only 5mb file size
  fileFilter, // /jpg|png|jpeg/ only these files are accepted
});

const item_image_upload_router = Express.Router();

item_image_upload_router
  .route("/")
  .post(uploadStorage.single("thumbnail"), uploadImage);

export default item_image_upload_router;
