import AppError from "./appErros";
import { Request, Response, NextFunction } from "express";

const errorHandlerMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") {
    handleDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    handleProdError(err, res);
  }
};

const handleDevError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleProdError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }
};

const handleDBCastError = (error: any) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 404);
};

const handleDBValidatorError = (error: any) => {
  return new AppError(error.message, 404);
};

const handleDuplicateDBError = (error: any) => {
  const message = `Field duplicate error`;
  return new AppError(message, 404);
};

const handleJwtError = (error: any) => {
  const message = `Authentication error`;
  return new AppError(message, 404);
};

export { errorHandlerMiddleware };
