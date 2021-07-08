import { Router } from "express";

import { ValidateCredentialsController } from "@modules/auth/useCases/validateCredentials/validateCredentialsController";

const authenticateRoutes = Router();

const validateCredentialsController = new ValidateCredentialsController();

authenticateRoutes.post("/sessions", validateCredentialsController.handle);

export { authenticateRoutes };
