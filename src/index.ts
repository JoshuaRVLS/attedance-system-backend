import express from "express";
import { sequelize } from "./config/database";
import cors from "cors";
import StudentRouter from "./routers/student.router";
import ClassRouter from "./routers/class.router";
import { urlencoded } from "body-parser";
import BeautifyConsole from "beautify-console-log";

const app = express();
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["*"],
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/api/v1/students", StudentRouter);
app.use("/api/v1/classes", ClassRouter);

export const log = BeautifyConsole.getInstance();
log.config({ title: "BACKEND" });

(async () => {
  await sequelize.sync({});
  app.listen(8000, "0.0.0.0", () => log.info("Backend Online in 0.0.0.0:8000"));
})();
