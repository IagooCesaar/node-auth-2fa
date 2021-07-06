import { Request, Response } from "express";
import { container } from "tsyringe";

import { Generate2faKeyUseCase } from "./generate2faKeyUseCase";

class Generate2faKeyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;
    const generate2faKeyUseCase = container.resolve(Generate2faKeyUseCase);

    const key = await generate2faKeyUseCase.execute(user_id);

    return response.status(201).json(key);
  }
}

export { Generate2faKeyController };
