import { Router } from "express";

const usersRoutes = Router();

usersRoutes.get("/", (req, res) => {
  return res.json({
    message: "Success!",
  });
});

export { usersRoutes };
