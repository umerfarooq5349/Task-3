import Express from "express";
import { signUp, login } from "../controllers/authentication_controller";

const authRouter = Express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);

export default authRouter;
