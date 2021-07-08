import { Router } from "express";

import { ValidateCredentialsController } from "@modules/auth/useCases/validateCredentials/validateCredentialsController";
import { ValidateTwoFactorKeyController } from "@modules/auth/useCases/validateTwoFactorKey/validateTwoFactorKeyController";

const authenticateRoutes = Router();

const validateCredentialsController = new ValidateCredentialsController();
const validateTwoFactorKeyController = new ValidateTwoFactorKeyController();

authenticateRoutes.post("/", validateCredentialsController.handle);
authenticateRoutes.post("/twofactor", validateTwoFactorKeyController.handle);

export { authenticateRoutes };
