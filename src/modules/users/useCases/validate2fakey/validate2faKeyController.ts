import { Request, Response } from "express";
import { container } from "tsyringe";

import { Validate2faKeyUseCase } from "./validate2faKeyUseCase";

class Validate2faKeyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id, totp_code } = request.body;
    const validate2faKeyUseCase = container.resolve(Validate2faKeyUseCase);
    const result = await validate2faKeyUseCase.execute({ user_id, totp_code });
    return response.status(200).json(result);
  }
}

export { Validate2faKeyController };
