import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./refreshTokenUseCase";

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const oldRefreshToken =
      request.body.refreshToken ||
      request.headers["x-access-token"] ||
      request.query.refreshToken;
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const refreshToken = await refreshTokenUseCase.execute(oldRefreshToken);
    return response.status(200).json(refreshToken);
  }
}

export { RefreshTokenController };
