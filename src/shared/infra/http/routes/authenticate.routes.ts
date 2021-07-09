import { Router } from "express";

import { RefreshTokenController } from "@modules/auth/useCases/refreshToken/refreshTokenController";
import { ValidateCredentialsController } from "@modules/auth/useCases/validateCredentials/validateCredentialsController";
import { ValidateTwoFactorKeyController } from "@modules/auth/useCases/validateTwoFactorKey/validateTwoFactorKeyController";

const authenticateRoutes = Router();

const validateCredentialsController = new ValidateCredentialsController();
const validateTwoFactorKeyController = new ValidateTwoFactorKeyController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post("/", validateCredentialsController.handle);
authenticateRoutes.post("/two-factor", validateTwoFactorKeyController.handle);
authenticateRoutes.post("/refresh-token", refreshTokenController.handle);

export { authenticateRoutes };
