import dontenv from "dotenv";
import app from "./app";
dontenv.config({ path: "./config.env" });

import mongoose = require("mongoose");
const port = process.env.PORT || 8000;
mongoose.connect(process.env.DATABASE_URL ?? "").then(() => {
  console.log("connected to database");
});

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} environment`
  );
});
