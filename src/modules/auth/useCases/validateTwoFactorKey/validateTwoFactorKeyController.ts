import { Request, Response } from "express";
import { container } from "tsyringe";

import { ValidateTwoFactorKeyUseCase } from "./validateTwoFactorKeyUseCase";

class ValidateTwoFactorKeyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { totp_code, temporaryToken } = request.body;

    const validateTwoFactorKeyUseCase = container.resolve(
      ValidateTwoFactorKeyUseCase
    );

    const token = await validateTwoFactorKeyUseCase.execute({
      temporaryToken,
      totp_code,
    });

    return response.status(200).json(token);
  }
}

export { ValidateTwoFactorKeyController };
