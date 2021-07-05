import "express-async-errors";
import "reflect-metadata";
import "@shared/container";

import express from "express";
import { createConnection } from "typeorm";

import { handlingErrors } from "./middlewares/handlingErrors";
import { router } from "./routes";

createConnection();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

app.use(router);
app.use(handlingErrors);

export { app };
