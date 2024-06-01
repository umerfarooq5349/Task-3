import mongoose from "mongoose";
import User from "./../model/users_model";
import catchAsync from "./../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);
    res.status(201).json({ statues: "success", data: { newUser } });
  }
);

export default signUp;
