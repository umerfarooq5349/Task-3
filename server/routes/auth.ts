import Express from "express";
import signUp from "../controllers/auth_controller";

const authRouter = Express.Router();

authRouter.post("/signup", signUp);

export default authRouter;
