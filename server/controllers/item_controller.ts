import Item from "../model/item_model";
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "./appErros";

const getItems = catchAsync(async (req: Request, res: Response) => {
  const item = await Item.find();
  res.status(200).json({ status: "success", total: item.length, data: item });
});

const getItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return new AppError("Item not found", 404);
  }
  const item = await Item.findById(id);
  res.status(200).json({ status: "success", data: item });
});
const addItem = catchAsync(async (req: Request, res: Response) => {
  const item = await Item.create(req.body);

  res.status(200).json({ status: "success", data: item });
});

const updateItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return new AppError("Item not found", 404);
  }
  const item = await Item.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ status: "success", data: item });
});
const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const item = await Item.findByIdAndDelete(id, req.body);
  res.status(200).json({ status: "success", data: item });
});

export { getItems, addItem, updateItem, deleteItem, getItem };
