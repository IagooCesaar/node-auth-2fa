import { Request, Response } from "express";
import { container } from "tsyringe";

import { ProfileUserUseCase } from "./profileUserUseCase";

class ProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const profileUserUseCase = container.resolve(ProfileUserUseCase);
    const user = await profileUserUseCase.execute(id);
    return response.status(200).json(user);
  }
}

export { ProfileUserController };
