import dontenv from "dotenv";
import jwt from "jsonwebtoken";
dontenv.config({ path: "./config.env" });

export const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
