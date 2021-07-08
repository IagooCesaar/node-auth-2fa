import { Request, Response } from "express";
import { container } from "tsyringe";

import { ValidateCredentialsUseCase } from "./validateCredentialsUseCase";

class ValidateCredentialsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const validateCredentialsUseCase = container.resolve(
      ValidateCredentialsUseCase
    );

    const validation = await validateCredentialsUseCase.execute({
      email,
      password,
    });
    return response.status(200).json(validation);
  }
}

export { ValidateCredentialsController };
