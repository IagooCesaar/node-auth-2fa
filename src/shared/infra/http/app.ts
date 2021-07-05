import "express-async-errors";
import express from "express";
import { createConnection } from "typeorm";

import { handlingErrors } from "./middlewares/handlingErrors";

createConnection();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

app.use(handlingErrors);

export { app };
