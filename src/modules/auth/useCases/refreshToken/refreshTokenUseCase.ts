import { sign, TokenExpiredError, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUserTokensRepository } from "@modules/auth/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

import { RefreshTokenError } from "./refreshTokenError";

interface IResponse {
  token: string;
  refreshToken: string;
}

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(refreshToken: string): Promise<IResponse> {
    let decoded = null;
    try {
      decoded = verify(refreshToken, auth.secret_refresh_token) as IPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new RefreshTokenError.RefreshTokenExpires();
      }
    }
    const { email, sub: user_id } = decoded;

    const userToken =
      await this.userTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        refreshToken
      );
    if (!userToken) {
      throw new RefreshTokenError.RefreshTokenNotExists();
    }

    // verificar validade do refreshTokenError
    if (
      this.dateProvider.checkIsBefore(
        userToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      await this.userTokensRepository.deleteById(userToken.id);
      throw new RefreshTokenError.RefreshTokenExpires();
    }

    await this.userTokensRepository.deleteById(userToken.id);

    // gerar token
    const token = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in,
    });

    // gerar refresh token
    const newRefreshToken = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });

    // armazenar refresh token
    const refresh_token_expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days,
      null
    );
    await this.userTokensRepository.create({
      user_id,
      refresh_token: refreshToken,
      expires_date: refresh_token_expires_date,
    });

    return {
      token,
      refreshToken: newRefreshToken,
    };
  }
}

export { RefreshTokenUseCase };
