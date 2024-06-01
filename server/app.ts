import Express from "express";
import itemRouter from "./routes/item_routes";
import cors from "cors";
import { errorHandlerMiddleware } from "./controllers/errors";
import item_image_upload_router from "./routes/item_image_upload";
const app = Express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(cors());
app.use(Express.json());
app.use("/uploads", Express.static("uploads"));

app.use("/api/items", itemRouter);
app.use("/api/upload", item_image_upload_router);

app.use(errorHandlerMiddleware);
export default app;
