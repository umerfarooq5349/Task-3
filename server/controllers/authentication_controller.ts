import mongoose from "mongoose";
import User from "../model/users_model";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "./appErros";
import { signToken } from "../utils/signinToken";

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!);

    res.status(201).json({ statues: "success", token, data: { newUser } });
  }
);

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
  });
});

export { signUp, login };
