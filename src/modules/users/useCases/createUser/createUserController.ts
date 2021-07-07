import { Request, Response } from "express";
import { container } from "tsyringe";

import { Generate2faKeyUseCase } from "../generate2faKey/generate2faKeyUseCase";
import { CreateUserUseCase } from "./createUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUserUseCase = container.resolve(CreateUserUseCase);
    const generate2faKeyUseCase = container.resolve(Generate2faKeyUseCase);

    const user = await createUserUseCase.execute({
      email,
      name,
      password,
    });

    const { qrcode_url: totp_qrcode } = await generate2faKeyUseCase.execute(
      user.id
    );

    return response.status(201).json({ user, totp_qrcode });
  }
}

export { CreateUserController };
