import User from "../model/users_model";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import AppError from "./appErros";
import { promisify } from "util";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: any; // Define a more specific user type if available
}

const protectedRoute = catchAsync(async (req, res, next) => {
  //geting token and check it is textUnderlinePosition:
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // verify token
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  console.log(decoded);

  // check if user still exists
  const logedIn_user = await User.findById(decoded.id);
  if (!logedIn_user) {
    return next(new AppError("User not found", 404));
  }

  // check if user changed password after token issued

  next();
});

const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized to perform this action", 403)
      );
    }
    next();
  };
};

export { protectedRoute, restrictTo };
