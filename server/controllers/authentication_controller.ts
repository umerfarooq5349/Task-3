import mongoose from "mongoose";
import User from "../model/users_model";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "./appErros";
import { signToken } from "./../utils/signinToken"; // Ensure correct import

interface UserDocument extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  role: string;
  checkPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user._id);
  const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    createSendToken(newUser, 201, res);
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.checkPassword(password, user.password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    createSendToken(user, 200, res);
  }
);

export { signUp, login };
