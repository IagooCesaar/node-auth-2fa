import { Router } from "express";

import { CreateUserController } from "@modules/users/useCases/createUser/createUserController";
import { Generate2faKeyController } from "@modules/users/useCases/generate2faKey/generate2faKeyController";

const usersRoutes = Router();

const createUserController = new CreateUserController();
const generate2faKeyController = new Generate2faKeyController();

usersRoutes.post("/", createUserController.handle);
usersRoutes.post("/generate2fa", generate2faKeyController.handle);

export { usersRoutes };
